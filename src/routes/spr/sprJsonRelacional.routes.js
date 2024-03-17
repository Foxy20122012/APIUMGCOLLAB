import { Router } from 'express';
import { spController } from '../../controllers/spr/sprJsonRelacional.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.post('/dataJson', spController);

export default router;
