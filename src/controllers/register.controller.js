import bcrypt from 'bcrypt';
import { pool } from "../db.js";

export const registerUser = async (req, res) => {
    const { nombre, correo, contraseña, rol } = req.body;

    try {
        // Generar el hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el nuevo usuario con la contraseña encriptada
        const newUser = {
            nombre,
            correo,
            contraseña: hashedPassword,
            rol
        };

        // Insertar el nuevo usuario en la base de datos
        await pool.query('INSERT INTO Usuarios SET ?', [newUser]);

        // Responder con un mensaje de éxito
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        // Manejar errores
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
};
