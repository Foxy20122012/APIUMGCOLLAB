// src/config/multer.js

import multer from 'multer';

// Configuración para almacenar archivos en buffer
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;
