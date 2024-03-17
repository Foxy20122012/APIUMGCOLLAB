import { Router } from 'express';
import { spController } from '../../../controllers/spr/sprParams/spr.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.post('/data', spController);

export default router;
