import { pool } from '../db.js';


export const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM product");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos');
    }
}

