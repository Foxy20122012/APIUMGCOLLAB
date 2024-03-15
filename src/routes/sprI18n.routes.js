import { Router } from 'express';
import { spController } from '../controllers/sprI18n.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.post('/i18n', spController);

export default router;
