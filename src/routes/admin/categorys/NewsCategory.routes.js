import express from 'express';
import { getNewsDetails, addNewsDetail, updateNewsDetail, deleteNewsDetail } from '../../../controllers/admin/categorys/NewsCategory.controller.js';

const router = express.Router();

// Obtener todos los detalles de la categoría "Noticias"
router.get('/categoria/news', getNewsDetails);

// Agregar un nuevo detalle para la categoría "Noticias"
router.post('/categoria/news', addNewsDetail);

// Actualizar un detalle de la categoría "Noticias"
router.put('/categoria/news/:id', updateNewsDetail);

// Eliminar un detalle de la categoría "Noticias"
router.delete('/categoria/news/:id', deleteNewsDetail);

export default router;
