import { Router } from 'express';
import {getPostsByUser, createPost } from '../../../controllers/students/post/postStudent.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/postStudent', getPostsByUser);
router.post('/postStudent', createPost);

export default router;