import { Router } from 'express';
import { getTopics} from '../../../controllers/admin/topics/topics.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/topics', getTopics);

export default router;