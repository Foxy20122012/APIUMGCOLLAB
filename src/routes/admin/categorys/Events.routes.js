import { Router } from 'express';
import { getEventDetails, addEventDetail, updateEventDetail, deleteEventDetail } from '../../../controllers/admin/categorys/EventsCategory.controller.js'; 
// Asegúrate de que el nombre y la ruta del archivo sean correctos

const router = Router();

// Ruta para obtener los detalles de la categoría "Eventos"
router.get('/categoria/eventos', getEventDetails);

// Ruta para agregar un nuevo detalle de la categoría "Eventos"
router.post('/categoria/eventos', addEventDetail);

// Ruta para actualizar un detalle de la categoría "Eventos" por ID
router.put('/categoria/eventos/:id', updateEventDetail);

// Ruta para eliminar un detalle de la categoría "Eventos" por ID
router.delete('/categoria/eventos/:id', deleteEventDetail);

export default router;
