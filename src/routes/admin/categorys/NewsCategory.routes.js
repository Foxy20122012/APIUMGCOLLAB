import express from 'express';
import { getNewsDetails, addNewsDetail, updateNewsDetail, deleteNewsDetail } from '../../../controllers/admin/categorys/NewsCategory.controller.js';

const router = express.Router();

// Obtener todos los detalles de la categoría "Noticias"
router.get('/newsCategory', getNewsDetails);

// Agregar un nuevo detalle para la categoría "Noticias"
router.post('/newsCategory', addNewsDetail);

// Actualizar un detalle de la categoría "Noticias"
router.put('/newsCategory/:id', updateNewsDetail);

// Eliminar un detalle de la categoría "Noticias"
router.delete('/newsCategory/:id', deleteNewsDetail);

export default router;
