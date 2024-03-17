import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from "../../db.js";

export const loginAdmin = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar al administrador por correo electrónico
        const [admins] = await pool.query('SELECT * FROM Usuarios WHERE correo = ? AND rol = "administrador"', [correo]);

        // Verificar si se encontró al administrador
        if (admins.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const admin = admins[0];

        // Verificar la contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, admin.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: admin.id, rol: admin.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Responder con el token
        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión del administrador:', error);
        res.status(500).json({ error: 'Error en el inicio de sesión del administrador' });
    }
};
