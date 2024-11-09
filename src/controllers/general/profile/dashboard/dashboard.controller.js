import { pool } from '../../../../db.js';
import jwt from 'jsonwebtoken';

// Clave secreta para decodificar el token

export const getDashboardMetrics = async (req, res) => {
    try {
    

      
        // Consultar el conteo de usuarios activos
        const [activeUsers] = await pool.query(`
            SELECT COUNT(*) as totalActiveUsers
            FROM Usuarios
            WHERE activo = 1
        `);

        // Consultar el conteo de posts según su estado
        const [postsMetrics] = await pool.query(`
            SELECT 
                estado, 
                COUNT(*) as total
            FROM Posts
            GROUP BY estado
        `);

        // Consultar el conteo de categorías
        const [categoriesMetrics] = await pool.query(`
            SELECT 
                nombre_categoria, 
                COUNT(*) as total
            FROM Categoria_Detalle
            GROUP BY nombre_categoria
        `);

        // Responder con las métricas obtenidas
        res.json({
            activeUsers: activeUsers[0].totalActiveUsers,
            postsMetrics,
            categoriesMetrics
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
