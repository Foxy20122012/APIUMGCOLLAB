import { pool } from "../db.js";
import { Router } from 'express';

const router = Router(); // Crea una instancia de Router


router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    try {
        await pool.query('INSERT INTO links SET ?', [newLink]);
        res.status(201).json({ message: 'Link Saved Successfully' });
    } catch (error) {
        console.error('Error saving link:', error);
        res.status(500).json({ error: 'Error saving link' });
    }
});

router.get('/add', async (req, res) => {
    try {
        const links = await pool.query('SELECT * FROM links');
        res.json({ links });
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ error: 'Error fetching links' });
    }
});

router.delete('/add:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM links WHERE id = ?', [id]);
        res.json({ message: 'Link Removed Successfully' });
    } catch (error) {
        console.error('Error removing link:', error);
        res.status(500).json({ error: 'Error removing link' });
    }
});

router.put('/add:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body; 
    const updatedLink = {
        title,
        description,
        url
    };
    try {
        await pool.query('UPDATE links SET ? WHERE id = ?', [updatedLink, id]);
        res.json({ message: 'Link Updated Successfully' });
    } catch (error) {
        console.error('Error updating link:', error);
        res.status(500).json({ error: 'Error updating link' });
    }
});

export default router;