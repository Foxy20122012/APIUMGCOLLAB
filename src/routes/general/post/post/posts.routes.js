import { Router } from "express";
import { addPost, getAllPosts, getPostById, updatePostById, deletePostById, getVisibleEventPosts, getVisiblePosts, getVisibleNewsPosts, 
    updatePostVisibility, getApprovedPosts, getApprovedNewsPosts, getApprovedEventsPosts, getApprovedPostById, getApprovedNewsPostById,
    getApprovedEventPostById, rejectPost

} from "../../../../controllers/general/profile/post/post/post.controller.js";
import upload from "../../../../config/multer.js"; // Configuración de multer para manejar las subidas de archivos

const router = Router();

// Ruta para crear un nuevo post, utilizando multer para múltiples imágenes y archivos
router.post("/posts", upload.fields([{ name: 'imagenes', maxCount: 60 }, { name: 'archivos', maxCount: 20 }]), addPost);

// Obtener todos los posts
router.get('/posts', getAllPosts);

// Obtener un post por ID
router.get('/posts/:id', getPostById);

// Obtener todos los posts visibles de eventos
router.get('/postsvisible', getVisiblePosts);

// Obtener todos los posts visibles de posts
router.get('/newssvisible', getVisibleNewsPosts);

// Obtener todos los posts visibles de noticias
router.get('/eventsvisible', getVisibleEventPosts);

// Actualizar visibilidad de un post mediante el cuerpo de la solicitud
router.put('/posts/visibility', updatePostVisibility);

//Rechazar los post, noticias, etc
router.put('/posts/reject/:id', rejectPost);

// Actualizar un post por ID, permitiendo la subida de imágenes y archivos opcional
router.put('/posts/:id', upload.fields([{ name: 'imagenes', maxCount: 15 }, { name: 'archivos', maxCount: 20 }]), updatePostById);

// Eliminar un post por ID
router.delete('/posts/:id', deletePostById);


//Seccion para traer las rutas de Post, Noticias y Eventos Aprobados y Visibles

// Obtener todos los posts visibles y aprobados de eventos
router.get('/postsApproved', getApprovedPosts);

// Obtener todos los posts visibles y aprobados por id
router.get('/posts/postsApproved/:id', getApprovedPostById);


// Obtener todos los posts visibles y aprobados de posts
router.get('/newsApproved', getApprovedNewsPosts);

// Obtener todos los posts visibles y aprobados por id
router.get('/posts/newsApproved/:id', getApprovedNewsPostById);


// Obtener todos los posts visibles y aprobados de noticias
router.get('/eventsApproved', getApprovedEventsPosts);

// Obtener todos los posts visibles y aprobados por id
router.get('/posts/eventsApproved/:id', getApprovedEventPostById);

export default router;
