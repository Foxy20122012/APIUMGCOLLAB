import { Router } from 'express';
import { getCoursesWithTopics } from '../controllers/cursos.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/cursos', getCoursesWithTopics);

export default router;
