import { Router } from 'express';
import {getPostsByUser } from '../../../controllers/students/post/postStudent.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/postStudent', getPostsByUser);

export default router;