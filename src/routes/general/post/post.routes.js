import { Router } from "express";
import { addPost } from "../../../controllers/general/profile/post/post.controller.js"; // Controlador para crear un post
import upload from "../../../config/multer.js"; // Configuración de multer para manejar las subidas de archivos

const router = Router();

// Ruta para crear un nuevo post, utilizando multer para múltiples imágenes y archivos
router.post("/addPost", upload.fields([{ name: 'imagenes', maxCount: 5 }, { name: 'archivos', maxCount: 5 }]), addPost);

export default router;
