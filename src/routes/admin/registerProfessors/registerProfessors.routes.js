import { Router } from 'express';
import { 
    getCatedraticos, 
    addCatedratico, 
    updateCatedratico, 
    deleteCatedratico 
} from '../../../controllers/admin/registerProfessors/registerProfessors.controller.js'; 
//../../../controllers/admin/usuarios/UsuariosCatedraticos.controller.js
// Asegúrate de que el nombre y la ruta del archivo del controlador sean correctos

const router = Router();

// Ruta para obtener todos los usuarios con rol "Catedratico"
router.get('/usuarios/catedraticos', getCatedraticos);

// Ruta para agregar un nuevo usuario con rol "Catedratico"
router.post('/usuarios/catedraticos', addCatedratico);

// Ruta para actualizar un usuario con rol "Catedratico" por ID
router.put('/usuarios/catedraticos/:id', updateCatedratico);

// Ruta para eliminar un usuario con rol "Catedratico" por ID
router.delete('/usuarios/catedraticos/:id', deleteCatedratico);

export default router;
