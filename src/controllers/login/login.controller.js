// authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../db.js';

export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar al usuario por correo electrónico
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE correo = ?', [correo]);

        // Si no se encuentra al usuario
        if (rows.length === 0) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = rows[0];

        // Comprobar el rol del usuario (solo para fines de demostración)
        if (usuario.rol !== 'administrador' && usuario.rol !== 'usuario') {
            return res.status(400).json({ mensaje: 'Rol de usuario no válido' });
        }

        // Comprobar la contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};
