import { Router } from "express";
import { addPost, getAllPosts, getPostById, updatePostById, deletePostById } from "../../../controllers/general/profile/post/post.controller.js";
import upload from "../../../config/multer.js"; // Configuración de multer para manejar las subidas de archivos

const router = Router();

// Ruta para crear un nuevo post, utilizando multer para múltiples imágenes y archivos
router.post("/posts", upload.fields([{ name: 'imagenes', maxCount: 5 }, { name: 'archivos', maxCount: 5 }]), addPost);

// Obtener todos los posts
router.get('/posts', getAllPosts);

// Obtener un post por ID
router.get('/posts/:id', getPostById);

// Actualizar un post por ID, permitiendo la subida de imágenes y archivos opcional
router.put('/posts/:id', upload.fields([{ name: 'imagenes', maxCount: 5 }, { name: 'archivos', maxCount: 5 }]), updatePostById);

// Eliminar un post por ID
router.delete('/posts/:id', deletePostById);

export default router;
