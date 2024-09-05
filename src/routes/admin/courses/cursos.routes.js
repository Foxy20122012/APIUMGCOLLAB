import { Router } from 'express';
import { 
  getCoursesWithTopics, 
  createCourse, 
  getCoursesWithTopicsExcel, 
  getCourseByIdExcel,  
  getCourseById, 
  updateCourse, 
  deleteCourse, 
  getCoursesWithTopicsPDF, 
  getCourseByIdPDF 
} from '../../../controllers/admin/courses/courses.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *     name: "Admin Routes"
 *     description: "Rutas de administración de cursos y tópicos"
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     tags:
 *        Admin Routes
 *     summary: "Obtiene todos los cursos con temas"
 *     responses:
 *       200:
 *         description: "Lista de cursos obtenida con éxito"
 */
router.get('/cursos', getCoursesWithTopics);

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     tags:
 *        Admin Routes
 *     summary: "Obtiene un curso específico por su ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso a obtener
 *     responses:
 *       200:
 *         description: "Curso obtenido con éxito"
 */
router.get('/cursos/:id', getCourseById);

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     tags:
 *        Admin Routes
 *     summary: "Actualiza un curso específico por su ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: "Nombre del curso"
 *               descripcion:
 *                 type: string
 *                 description: "Descripción del curso"
 *     responses:
 *       200:
 *         description: "Curso actualizado con éxito"
 */
router.put('/cursos/:id', updateCourse);

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     tags:
 *        Admin Routes
 *     summary: "Elimina un curso específico por su ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso a eliminar
 *     responses:
 *       200:
 *         description: "Curso eliminado con éxito"
 */
router.delete('/cursos/:id', deleteCourse);

/**
 * @swagger
 * /api/cursosExcel:
 *   get:
 *     tags:
 *        Admin Routes
 *     summary: "Genera un archivo Excel con todos los cursos y temas"
 *     responses:
 *       200:
 *         description: "Archivo Excel generado con éxito"
 */
router.get('/cursosExcel', getCoursesWithTopicsExcel);

/**
 * @swagger
 * /api/cursos/{id}/excel:
 *   get:
 *     tags:
 *        Admin Routes
 *     summary: "Genera un archivo Excel para un curso específico por su ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso a generar el Excel
 *     responses:
 *       200:
 *         description: "Archivo Excel generado con éxito"
 */
router.get('/cursos/:id/excel', getCourseByIdExcel);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     tags:
 *        Admin Routes
 *     summary: "Crea un nuevo curso"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: "Nombre del curso"
 *               descripcion:
 *                 type: string
 *                 description: "Descripción del curso"
 *     responses:
 *       201:
 *         description: "Curso creado con éxito"
 */
router.post('/cursos', createCourse);

/**
 * @swagger
 * /api/cursosPdf:
 *   get:
 *     tags:
 *        Admin Routes
 *     summary: "Genera un archivo PDF con todos los cursos y temas"
 *     responses:
 *       200:
 *         description: "Archivo PDF generado con éxito"
 */
router.get('/cursosPdf', getCoursesWithTopicsPDF);

/**
 * @swagger
 * /api/cursos/{id}/pdf:
 *   get:
 *     tags:
 *        Admin Routes
 *     summary: "Genera un archivo PDF para un curso específico por su ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso a generar el PDF
 *     responses:
 *       200:
 *         description: "Archivo PDF generado con éxito"
 */
router.get('/cursos/:id/pdf', getCourseByIdPDF);

export default router;
