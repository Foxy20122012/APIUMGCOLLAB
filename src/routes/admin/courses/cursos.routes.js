import { Router } from 'express';
import { getCoursesWithTopics, createCourse, getCoursesWithTopicsExcel, getCourseByIdExcel,  getCourseById, updateCourse, deleteCourse } from '../../../controllers/admin/courses/courses.controller.js';

const router = Router();

// Ejemplo de ruta que utiliza el controlador de data
router.get('/cursos', getCoursesWithTopics);

// Obtener un curso específico por su ID
router.get('/cursos/:id', getCourseById);

// Actualizar un curso específico por su ID
router.put('/cursos/:id', updateCourse);


// Eliminar un curso específico por su ID
router.delete('/cursos/:id', deleteCourse);

// Ruta para generar un archivo de Excel con los cursos y temas
router.get('/cursosExcel', getCoursesWithTopicsExcel);

//Ruta para generar Excel por ID

router.get('/cursos/:id/excel', getCourseByIdExcel);

router.post('/cursos', createCourse);

export default router;
