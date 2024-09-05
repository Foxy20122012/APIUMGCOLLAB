import { Router } from 'express';
import { getTopics, addTopic, updateTopic, deleteTopic} from '../../../controllers/admin/topics/topics.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/topics', getTopics);
router.post('/topics', addTopic)
router.put('/topics/:id', updateTopic);
router.delete('/topics/:id', deleteTopic); //Route delete topics


export default router;