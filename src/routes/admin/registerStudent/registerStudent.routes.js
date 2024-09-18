import { Router } from 'express';
import { getEstudiantes,  addEstudiante, updateEstudiante,  deleteEstudiante } from '../../../controllers/admin/registerStudents/registerStudenr.controller.js'; 


const router = Router();

// Rutas para usuarios con rol "Estudiante"
router.get('/usuarios/estudiantes', getEstudiantes); // Obtener todos los estudiantes
router.post('/usuarios/estudiantes', addEstudiante); // Crear un nuevo estudiante
router.put('/usuarios/estudiantes/:id', updateEstudiante); // Actualizar un estudiante por ID
router.delete('/usuarios/estudiantes/:id', deleteEstudiante); // Eliminar un estudiante por ID

export default router;
