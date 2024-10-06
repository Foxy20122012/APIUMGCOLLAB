// src/config/multer.js

import multer from 'multer';
import path from 'path';

// Configuración de multer para aceptar múltiples archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Almacena temporalmente en esta carpeta
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Genera un nombre único
  }
});

const upload = multer({ storage: storage });

export default upload;
