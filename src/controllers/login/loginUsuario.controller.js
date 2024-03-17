import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from "../../db.js";

export const loginUsuario = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar al usuario por correo electrónico
        const [usuarios] = await pool.query('SELECT * FROM Usuarios WHERE correo = ? AND rol = "usuario"', [correo]);

        // Si no se encuentra al usuario o no es de rol "usuario"
        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = usuarios[0];

        // Verificar la contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET);

        // Responder con el token
        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión del usuario:', error);
        res.status(500).json({ error: 'Error en el inicio de sesión del usuario' });
    }
};
