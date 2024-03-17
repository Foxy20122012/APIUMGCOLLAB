import { Router } from 'express';
import { spController } from '../../../controllers/spr/i18n/sprI18n.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.post('/i18n', spController);

export default router;
