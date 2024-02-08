import { Router } from 'express';
import { loginAdmin } from '../controllers/loginAdmin.controller.js';

const router = Router();

// Ruta para el inicio de sesión del administrador
router.post('/login/admin', loginAdmin);

export default router;
