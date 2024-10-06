import cloudinary from '../../../../config/cloudinary.js';
import { pool } from '../../../../db.js';
import { getUserFromToken } from '../../../../utils/token.js';

export const addPost = async (req, res) => {
  const { titulo, contenido, descripcion, fecha_evento, ubicacion_evento, prioridad, estado, nombre_curso, tipo_post } = req.body;

  // Validate if required fields are present
  if (!titulo || !contenido || !descripcion || !fecha_evento || !ubicacion_evento || !prioridad || !nombre_curso || !tipo_post) {
    return res.status(400).json({
      message: 'Faltan datos obligatorios. Por favor, completa todos los campos requeridos.',
    });
  }

  let user = getUserFromToken(req);

  if (!user) {
    // Si no hay token, asignar el usuario por defecto "develop"
    console.log("No token provided, assigning default user 'develop'.");
    user = { id: 13, nombre: 'develop' }; // ID y nombre de tu usuario 'develop'
  }

  const { id, nombre } = user;

  try {
    // Definir estado y visibilidad basados en el rol del usuario
    let postEstado = estado || 'pendiente';
    let postVisible = false;

    if (user.rol === 'administrador' || user.rol === 'catedratico') {
      postEstado = 'aprobado';
      postVisible = true;
    }

    // Crear el post en la base de datos primero
    const newPost = {
      titulo,
      contenido,
      descripcion,
      fecha_evento,
      ubicacion_evento,
      prioridad,
      estado: postEstado,
      visible: postVisible,
      tipo_post,
      autor_id: id, // Id del usuario creador (puede ser develop)
      autor_nombre: nombre, // Nombre del usuario creador
      nombre: nombre_curso, // Nombre del curso que será procesado por el trigger
      fecha_creacion: new Date(),
    };

    const [postResult] = await pool.query('INSERT INTO Posts SET ?', [newPost]);

    if (postResult.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo crear el post.' });
    }

    const postId = postResult.insertId; // ID del post recién creado

    // Procesar la subida de imágenes si existen
    let uploadedImages = [];
    if (req.files && req.files.imagenes && req.files.imagenes.length > 0) {
      const uploadPromises = req.files.imagenes.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: 'posts' })
      );
      const imageResults = await Promise.all(uploadPromises);
      uploadedImages = imageResults.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));
    }

    // Procesar la subida de archivos si existen
    let uploadedFiles = [];
    if (req.files && req.files.archivos && req.files.archivos.length > 0) {
      const uploadFilePromises = req.files.archivos.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: 'documentos' })
      );
      const fileResults = await Promise.all(uploadFilePromises);
      uploadedFiles = fileResults.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));
    }

    // Actualizar el post con las URLs de las imágenes y archivos
    const updatedPostData = {
      imagenes: uploadedImages.length > 0 ? JSON.stringify(uploadedImages) : null,
      archivos_adjuntos: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
      cloudinary_folder: 'posts',
    };

    await pool.query('UPDATE Posts SET ? WHERE id = ?', [updatedPostData, postId]);

    return res.status(201).json({
      message: 'Post creado y archivos subidos exitosamente.',
      postId,
      uploadedImages,
      uploadedFiles,
    });
  } catch (error) {
    console.error('Error al crear el post:', error);
    return res.status(500).json({ message: 'Error interno al crear el post.', error: error.message });
  }
};
