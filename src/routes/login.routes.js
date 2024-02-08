// authRoutes.js
import { Router } from 'express';
import { login } from '../controllers/login.controller.js';

const router = Router();

// Ruta para iniciar sesión
router.post('/login', login);

export default router;
