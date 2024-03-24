import { pool } from '../../../db.js';
import jwt from 'jsonwebtoken';

const secretKey = "4a5b9f8c67eafcd2d3b1e5270a84e6f1"; // Debes definir una clave secreta para la verificación del token

export const getPostsByUser = async (req, res) => {
    try {
        // Obtener el token del header de autorización
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verificar el token
        const decoded = jwt.verify(token, secretKey);

        // Asumiendo que el token decodificado contiene el id del usuario
        const userId = decoded.id;

        const [posts] = await pool.query(`
            SELECT 
                id,
                titulo,
                contenido,
                estado,
                visible,
                fecha_creacion,
                fecha_actualizacion,
                usuario_id,
                curso_id,
                nombre
            FROM 
                post
            WHERE 
                usuario_id = ?
        `, [userId]);

        res.json(posts);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error(error);
        console.error('Error details:', error);
   
        res.status(500).json({ message: "Something went wrong" });
    }
};
