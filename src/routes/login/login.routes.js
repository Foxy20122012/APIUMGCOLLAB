// authRoutes.js
import { Router } from 'express';
import { loginAdmin } from '../../controllers/login/login.controller.js';

const router = Router();

// Ruta para iniciar sesión
router.post('/loginAdmin', loginAdmin);

export default router;
