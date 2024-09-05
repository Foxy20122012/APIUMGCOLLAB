import { Router } from 'express';
import { getPostDetails, addPostDetail, updatePostDetail, deletePostDetail } from '../../../controllers/admin/categorys/PostCategory.controller.js';
//import { getPostDetails, addPostDetail, updatePostDetail, deletePostDetail } from '../../../controllers/admin/categories/category.controller.js';

const router = Router();

// Ruta para obtener los detalles de la categoría "Post"
router.get('/categoria/post', getPostDetails);

// Ruta para agregar un nuevo detalle de la categoría "Post"
router.post('/categoria/post', addPostDetail);

// Ruta para actualizar un detalle de la categoría "Post" por ID
router.put('/categoria/post/:id', updatePostDetail);

// Ruta para eliminar un detalle de la categoría "Post" por ID
router.delete('/categoria/post/:id', deletePostDetail);

export default router;
