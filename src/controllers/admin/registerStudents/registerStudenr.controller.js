import { pool } from '../../../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const JWT_SECRET = '4a5b9f8c67eafcd2d3b1e5270a84e6f1';
import { NODE_ENV } from "../../../config.js"; 
import { v4 as uuidv4 } from 'uuid'; // Para generar el código único de usuario



// Obtener todos los usuarios con rol estudiante
export const getEstudiantes = async (req, res) => {
    try {
        const [estudiantes] = await pool.query(`
            SELECT 
                id,
                codigo_usuario,
                nombre,
                apellido,
                correo,
                telefono,
                direccion,
                fecha_nacimiento,
                rol,
                puesto,
                fecha_registro,
                activo
            FROM Usuarios
            WHERE rol = 'estudiante'
        `);

        return res.status(200).json(estudiantes);
    } catch (error) {
        console.error('Error al obtener los usuarios con rol estudiante:', error);
        return res.status(500).json({ message: 'Hubo un error al obtener los estudiantes.' });
    }
};



// Crear un nuevo usuario con rol estudiante
export const addEstudiante = async (req, res) => {
    const { nombre, apellido, correo, contraseña, telefono, direccion, fecha_nacimiento } = req.body;

    try {
        // Validar que los campos obligatorios estén presentes
        if (!nombre || !apellido || !correo || !contraseña) {
            return res.status(400).json({ message: 'Por favor, completa los campos obligatorios: nombre, apellido, correo y contraseña.' });
        }

        // Verificar si ya existe un usuario con el mismo correo
        const [existingUser] = await pool.query('SELECT * FROM Usuarios WHERE correo = ?', [correo]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'El correo ya está registrado. Por favor, utiliza otro correo.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Generar un codigo_usuario único
        const codigo_usuario = `EST-${uuidv4().slice(0, 8).toUpperCase()}`; // Código de usuario basado en uuid

        // Crear el objeto para insertar
        const nuevoEstudiante = {
            codigo_usuario,
            nombre,
            apellido,
            correo,
            contraseña: hashedPassword,
            telefono: telefono || null, // Si no se proporciona, se guarda como NULL
            direccion: direccion || null,
            fecha_nacimiento: fecha_nacimiento || null,
            rol: 'estudiante', // Valor por defecto
            puesto: 'estudiante', // Valor por defecto
            fecha_registro: new Date(), // Se asigna la fecha actual al registrarse
            activo: 1, // Activo por defecto
            email_verificado: 0, // Inicialmente no verificado
            telefono_verificado: 0 // Inicialmente no verificado
        };

        // Insertar el nuevo estudiante en la base de datos
        await pool.query('INSERT INTO Usuarios SET ?', [nuevoEstudiante]);

        res.status(201).json({ message: 'Estudiante creado exitosamente', codigo_usuario });
    } catch (error) {
        console.error('Error al crear el estudiante:', error);
        res.status(500).json({ message: 'Hubo un error al crear el estudiante. Por favor, intenta de nuevo.' });
    }
};



// Actualizar un estudiante existente
export const updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono, direccion, fecha_nacimiento, ocupacion, intereses, preferencias_notificacion, activo, email_verificado, telefono_verificado, contraseña } = req.body;

    try {
        const { nombre_usuario } = getUserFromToken(req); // Extraer el usuario que realiza la operación

        // Creamos un objeto con los datos que se van a actualizar
        const datosActualizados = {
            nombre,
            apellido,
            correo,
            telefono,
            direccion,
            fecha_nacimiento,
            ocupacion,
            intereses,
            preferencias_notificacion,
            ultima_fecha_acceso: new Date(), // Actualizamos la última fecha de acceso
            nombre_usuario_actualizador: nombre_usuario, // Registrar quién actualizó
            activo: activo === true || activo === 1 ? 1 : 0, // Convertir booleano a 1/0 para la base de datos
            email_verificado: email_verificado === true || email_verificado === 1 ? 1 : 0, // Booleano a 1/0
            telefono_verificado: telefono_verificado === true || telefono_verificado === 1 ? 1 : 0 // Booleano a 1/0
        };

        // Si la contraseña es proporcionada, la encriptamos y la añadimos a los datos a actualizar
        if (contraseña) {
            const hashedPassword = await bcrypt.hash(contraseña, 10);
            datosActualizados.contraseña = hashedPassword;
        }

        // Ejecutamos la consulta de actualización
        await pool.query('UPDATE Usuarios SET ? WHERE id = ? AND rol = ?', [datosActualizados, id, 'estudiante']);

        res.status(200).json({ message: 'Estudiante actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        res.status(500).json({ message: 'Algo salió mal al actualizar el estudiante.' });
    }
};



// Eliminar un estudiante
export const deleteEstudiante = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM Usuarios WHERE id = ? AND rol = ?', [id, 'estudiante']);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró un estudiante con el id proporcionado.' });
        }

        res.json({ message: 'Estudiante eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        res.status(500).json({ message: 'Hubo un error al intentar eliminar el estudiante.' });
    }
};



