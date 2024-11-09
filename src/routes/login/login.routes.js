// authRoutes.js
import { Router } from 'express';
import { loginAdmin, loginTeacher } from '../../controllers/login/login.controller.js';

const router = Router();

// Ruta para iniciar sesión
router.post('/loginAdmin', loginAdmin);


// Ruta para iniciar sesión
router.post('/loginTeacher', loginTeacher);

// Ruta para iniciar sesión
router.post('/loginStudent', loginAdmin);

export default router;
