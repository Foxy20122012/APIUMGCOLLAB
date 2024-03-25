import { pool } from '../../../db.js';
import jwt from 'jsonwebtoken';

const secretKey = "4a5b9f8c67eafcd2d3b1e5270a84e6f1"; // Debes definir una clave secreta para la verificación del token

export const getPostsByUser = async (req, res) => {
    try {
        // Obtener el token del header de autorización
        const token = req.headers.authorization?.split(' ')[1];
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sIjoidXN1YXJpbyIsImlhdCI6MTcxMTMyNDA2OH0.5FnutgL3J5gi4-LcBRZTvY1t4Xy4q39ZBnJX9Mx4Ua8";

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

        const [Posts] = await pool.query(`
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
            Posts
            WHERE 
                usuario_id = ?
        `, [userId]);

        res.json(Posts);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
