import cloudinary from '../../../../config/cloudinary.js';
import { pool } from '../../../../db.js';
import { getUserFromToken } from '../../../../utils/token.js';

// Agregar un nuevo post
export const addPost = async (req, res) => {
  const { titulo, contenido, descripcion, fecha_evento, ubicacion_evento, prioridad, estado, nombre_curso, tipo_post } = req.body;

  // Validar campos requeridos
  if (!titulo || !contenido || !descripcion || !fecha_evento || !ubicacion_evento || !prioridad || !nombre_curso || !tipo_post) {
    return res.status(400).json({
      message: 'Faltan datos obligatorios. Por favor, completa todos los campos requeridos.',
    });
  }

  let user = getUserFromToken(req);

  if (!user) {
    // Si no hay token, asignar el usuario por defecto "develop"
    console.log("No token provided, assigning default user 'develop'.");
    user = { id: 13, nombre: 'develop' };
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
      autor_id: id, 
      autor_nombre: nombre, 
      nombre: nombre_curso, 
      fecha_creacion: new Date(),
    };

    const [postResult] = await pool.query('INSERT INTO Posts SET ?', [newPost]);

    if (postResult.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo crear el post.' });
    }

    const postId = postResult.insertId;

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

// Obtener todos los posts
export const getAllPosts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Posts');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).json({ message: 'Error al obtener los posts.', error: error.message });
  }
};

// Obtener un post por ID
export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Posts WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener el post con id ${id}:`, error);
    res.status(500).json({ message: 'Error al obtener el post.', error: error.message });
  }
};

// Actualizar un post por ID, incluyendo la subida opcional de imágenes y archivos
export const updatePostById = async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, descripcion, fecha_evento, ubicacion_evento, prioridad, estado, tipo_post } = req.body;

  try {
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

    // Actualizar el post con la nueva información
    const updatedPostData = {
      titulo,
      contenido,
      descripcion,
      fecha_evento,
      ubicacion_evento,
      prioridad,
      estado,
      tipo_post,
      imagenes: uploadedImages.length > 0 ? JSON.stringify(uploadedImages) : null,
      archivos_adjuntos: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
      cloudinary_folder: 'posts',
    };

    const [result] = await pool.query('UPDATE Posts SET ? WHERE id = ?', [updatedPostData, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json({ message: 'Post actualizado exitosamente' });
  } catch (error) {
    console.error(`Error al actualizar el post con id ${id}:`, error);
    res.status(500).json({ message: 'Error al actualizar el post.', error: error.message });
  }
};

// Eliminar un post por ID
export const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM Posts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar el post con id ${id}:`, error);
    res.status(500).json({ message: 'Error al eliminar el post.', error: error.message });
  }
};
