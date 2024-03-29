
import { pool } from '../../../db.js';
import jwt from 'jsonwebtoken';


const secretKey = "4a5b9f8c67eafcd2d3b1e5270a84e6f1"; // Debes definir una clave secreta para la verificación del token

export const getProfileUser = async (req, res) => {
    try {
        // Obtener el token del header de autorización
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verificar el token
        const decoded = jwt.verify(token, secretKey);

        // Verificar que el token ha sido decodificado correctamente
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Asumiendo que el token decodificado contiene el id del usuario
        const userId = decoded.id;

        // Obtener los datos del usuario
        const [userData] = await pool.query(`
            SELECT 
                id,
                nombre,
                correo,
                imagen_perfil,
                telefono,
                apellido,
                rol
            FROM 
                Usuarios
            WHERE 
                id = ?
        `, [userId]);

        res.json(userData);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
