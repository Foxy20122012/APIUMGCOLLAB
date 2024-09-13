import { pool } from '../../../db.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = '4a5b9f8c67eafcd2d3b1e5270a84e6f1';
import { NODE_ENV } from "../../../config.js"; 

// Middleware para extraer el usuario del token
const getUserFromToken = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        if (NODE_ENV === 'production') {
            return {
                id_usuario: null,
                nombre_usuario: 'Api'
            };
        } else {
            return {
                id_usuario: null,
                nombre_usuario: 'Develop'
            };
        }
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
        id_usuario: decoded.id_usuario, 
        nombre_usuario: decoded.nombre_usuario
    };
};

// Obtener todos los detalles de la categoría "Eventos"
export const getEventDetails = async (req, res) => {
    try {
        const [details] = await pool.query(`
            SELECT 
                Categoria_Detalle.id_detalle,
                Categoria_Detalle.numero_categoria,
                Categoria_Detalle.nombre_categoria,
                Categoria_Detalle.codigo_categoria,
                Categoria_Detalle.descripcion,
                Categoria_Detalle.alias,
                Categoria_Detalle.estado,
                Categoria_Detalle.id_usuario_creador,
                Categoria_Detalle.nombre_usuario_creador,
                Categoria_Detalle.nombre_usuario_actualizador,
                Categoria_Detalle.fecha_creado,
                Categoria.nombre_categoria AS categoria_general
            FROM 
                Categoria_Detalle
            LEFT JOIN 
                Categoria ON Categoria_Detalle.numero_categoria = Categoria.numero_categoria
            WHERE 
                Categoria_Detalle.numero_categoria = 3
        `);

        return res.status(200).json(details);
    } catch (error) {
        console.error('Error al obtener los detalles de los eventos:', error);
        return res.status(500).json({ message: 'Algo salió mal al obtener los detalles de los eventos.' });
    }
};

// Agregar un nuevo detalle para la categoría "Eventos"
export const addEventDetail = async (req, res) => {
    const { descripcion, alias } = req.body;

    try {
        const nombre_usuario_creador = getUserFromToken(req);

        const [rows] = await pool.query(`
            SELECT codigo_categoria 
            FROM Categoria_Detalle 
            WHERE nombre_categoria = 'Eventos'
            ORDER BY id_detalle DESC 
            LIMIT 1
        `);

        let nuevoCodigoCategoria = 'EVE-001'; 

        if (rows.length > 0) {
            const ultimoCodigo = rows[0].codigo_categoria;
            const numeroActual = parseInt(ultimoCodigo.split('-')[1]);
            const nuevoNumero = (numeroActual + 1).toString().padStart(3, '0');
            nuevoCodigoCategoria = `EVE-${nuevoNumero}`;
        }

        const nuevoDetalle = {
            numero_categoria: 3, 
            nombre_categoria: 'Eventos',
            codigo_categoria: nuevoCodigoCategoria,
            descripcion,
            alias,
            estado: 'activo',
            id_usuario_creador: 1, 
            nombre_usuario_creador,
            fecha_creado: new Date()
        };

        await pool.query('INSERT INTO Categoria_Detalle SET ?', [nuevoDetalle]);

        res.status(201).json({ message: 'Detalle de la categoría "Eventos" creado exitosamente', codigo_categoria: nuevoCodigoCategoria });
    } catch (error) {
        console.error('Error al crear el detalle de la categoría "Eventos":', error);
        res.status(500).json({ message: 'Algo salió mal al crear el detalle de la categoría "Eventos".' });
    }
};

// Actualizar un detalle de la categoría "Eventos"
export const updateEventDetail = async (req, res) => {
    const { descripcion, alias, estado } = req.body;  // Excluye el codigo_categoria de req.body
    const { id } = req.params;

    try {
        // Recuperar el detalle actual para mantener el codigo_categoria si no se proporciona
        const [rows] = await pool.query('SELECT codigo_categoria FROM Categoria_Detalle WHERE id_detalle = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Detalle no encontrado' });
        }

        const codigo_categoria = rows[0].codigo_categoria;  // Mantener el codigo_categoria sin cambios
        const nombre_usuario_actualizador = getUserFromToken(req).nombre_usuario;

        const detalleActualizado = {
            codigo_categoria,  // Se mantiene sin cambios
            descripcion,
            alias,
            estado,
            nombre_usuario_actualizador
        };

        await pool.query('UPDATE Categoria_Detalle SET ? WHERE id_detalle = ?', [detalleActualizado, id]);
        res.status(200).json({ message: 'Detalle de la categoría "Eventos" actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el detalle de la categoría "Eventos":', error);
        res.status(500).json({ message: 'Algo salió mal al actualizar el detalle de la categoría "Eventos".' });
    }
};


// Eliminar un detalle de la categoría "Eventos"
export const deleteEventDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM Categoria_Detalle WHERE id_detalle = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró el detalle de la categoría "Eventos" con el id proporcionado.' });
        }

        res.json({ message: 'Detalle de la categoría "Eventos" eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el detalle de la categoría "Eventos":', error);
        res.status(500).json({ message: 'Algo salió mal al intentar eliminar el detalle de la categoría "Eventos".' });
    }
};
