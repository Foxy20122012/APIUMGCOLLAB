// src/config/multer.js
import multer from 'multer';

const storage = multer.memoryStorage(); // Almacenamiento en memoria para subir a Cloudinary directamente

const upload = multer({ storage: storage });

export default upload;
