import { Router } from 'express';
import { getCoursesWithTopics } from '../controllers/cursos.controller';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.post('/cursos', getCoursesWithTopics);

export default router;
