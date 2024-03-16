// adminLogout.routes.js
import express from 'express';
import { adminLogout } from '../controllers/login/adminLogout.controller.js';

const router = express.Router();

// Ruta para cerrar la sesión del administrador
router.post('/logout/admin', adminLogout);

export default router;
