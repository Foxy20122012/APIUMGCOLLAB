import { Router } from 'express';
import {getPostsByUser, createPost, updatePost } from '../../../controllers/students/post/postStudent.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/postStudent', getPostsByUser);
router.post('/postStudent', createPost);
// Suponiendo que 'router' es tu Router de express
router.put('/postStudent/:id', updatePost); // Para actualizar un post


export default router;