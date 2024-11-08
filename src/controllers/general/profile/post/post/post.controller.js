import cloudinary from '../../../../../config/cloudinary.js';
import { pool } from '../../../../../db.js';
import { getUserFromToken } from '../../../../../utils/token.js';


// Agregar un nuevo post
// Agregar un nuevo post
export const addPost = async (req, res) => {
  const { 
    titulo, 
    tema, // Cambiado de 'contenido' a 'tema' aquí
    descripcion, 
    fecha_evento, 
    ubicacion_evento, 
    prioridad, 
    estado, 
    nombre_curso, 
    tipo_post, 
    ubicacion_detallada, 
    url_externa, 
    tipo_contenido, 
    fecha_publicacion 
  } = req.body;

  // Lista de campos requeridos y verificación de los que faltan
  const requiredFields = {
    titulo,
    tema, // Cambiado 'contenido' a 'tema'
    descripcion,
    fecha_evento,
    ubicacion_evento,
    prioridad,
    nombre_curso,
    tipo_post
  };

  const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: 'Faltan datos obligatorios.',
      missingFields 
    });
  }

  console.log("archivos recibidos del frontend archivos", req.files);

  // Obtener el usuario desde el token o asignar usuario por defecto
  let user = getUserFromToken(req);
  if (!user) {
    console.log("No token provided, assigning default user 'develop'.");
    user = { id: 13, nombre: 'develop' };
  }

  const { id, nombre } = user;

  try {
    // Definir estado del post basado en el rol del usuario
    let postEstado = estado || 'pendiente';
    let postVisible = false;
    let fechaCreacion = null;

    if (user.rol === 'administrador' || user.rol === 'catedratico') {
      postEstado = 'aprobado';
      postVisible = true;
      fechaCreacion = new Date();
    }

    // Crear el post en la base de datos
    const newPost = {
      titulo,
      contenido: tema || null, // Guardar `tema` en `contenido` si aplica
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
      fecha_creacion: fechaCreacion,
      ubicacion_detallada: ubicacion_detallada || null,
      url_externa: url_externa ? JSON.stringify(url_externa) : null,
      tipo_contenido: tipo_contenido || null,
      fecha_publicacion: fecha_publicacion || null
    };

    const [postResult] = await pool.query('INSERT INTO Posts SET ?', [newPost]);

    if (postResult.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo crear el post.' });
    }

    const postId = postResult.insertId;

    // Subir imágenes a Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.imagenes && req.files.imagenes.length > 0) {
      const uploadPromises = req.files.imagenes.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'posts' }, (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          });
          uploadStream.end(file.buffer);
        });
      });
      uploadedImages = await Promise.all(uploadPromises);
    }

    // Subir archivos adjuntos a Cloudinary (archivos no imágenes)
    let uploadedFiles = [];
    if (req.files && req.files.archivos && req.files.archivos.length > 0) {
      const uploadFilePromises = req.files.archivos.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ 
            folder: 'documentos', 
            resource_type: 'raw'
          }, (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          });
          uploadStream.end(file.buffer);
        });
      });
      uploadedFiles = await Promise.all(uploadFilePromises);
    }

    // Actualizar el post con las URLs de las imágenes y archivos adjuntos
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




export const getVisibleEventPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 0 AND tipo_post = "evento"'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};


//Visibilidad de post
export const getVisiblePosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 0 AND estado = "pendiente" AND tipo_post = "post"'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};


//Visibilidad de noticias
export const getVisibleNewsPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 0 AND tipo_post = "noticia"'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};

//Visibilidad de noticias
export const getVisibleEventsPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 0 AND tipo_post = "evento"'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};



// Sección para traer todos los Posts, Eventos y Noticias Visibles y Aprobadas


//Visibilidad de post
export const getApprovedPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 1 AND estado = "aprobado" AND tipo_post = "post"'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};

// Obtener post aprobado por ID
export const getApprovedPostById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del post desde los parámetros de la URL
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE id = ? AND visible = 1 AND estado = "aprobado" AND tipo_post = "post"',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post no encontrado o no aprobado.' });
    }

    res.status(200).json(rows[0]); // Devuelve el primer resultado encontrado
  } catch (error) {
    console.error('Error al obtener el post aprobado por ID:', error);
    res.status(500).json({ message: 'Error al obtener el post aprobado.', error: error.message });
  }
};


//Visibilidad de noticias
export const getApprovedNewsPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 1 AND estado = "aprobado" AND tipo_post = "noticia"'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};


// Obtener noticia aprobada por ID
export const getApprovedNewsPostById = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la noticia desde los parámetros de la URL
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE id = ? AND visible = 1 AND estado = "aprobado" AND tipo_post = "noticia"',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Noticia no encontrada o no aprobada.' });
    }

    res.status(200).json(rows[0]); // Devuelve la primera noticia encontrada
  } catch (error) {
    console.error('Error al obtener la noticia aprobada por ID:', error);
    res.status(500).json({ message: 'Error al obtener la noticia aprobada.', error: error.message });
  }
};



//Visibilidad de eventos+
export const getApprovedEventsPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE visible = 1 AND estado = "aprobado" AND tipo_post = "evento"' 
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos visibles:', error);
    res.status(500).json({ message: 'Error al obtener los eventos visibles.', error: error.message });
  }
};



// Obtener evento aprobado por ID
export const getApprovedEventPostById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del evento desde los parámetros de la URL
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Posts WHERE id = ? AND visible = 1 AND estado = "aprobado" AND tipo_post = "evento"',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado o no aprobado.' });
    }

    res.status(200).json(rows[0]); // Devuelve el primer evento encontrado
  } catch (error) {
    console.error('Error al obtener el evento aprobado por ID:', error);
    res.status(500).json({ message: 'Error al obtener el evento aprobado.', error: error.message });
  }
};









// Actualizar visibilidad y estado de post
export const updatePostVisibility = async (req, res) => {
  const { id } = req.body; // Obtiene el ID del post desde el cuerpo de la solicitud
  try {
    const [result] = await pool.query(
      'UPDATE Posts SET visible = 1, estado = "aprobado" WHERE id = ? AND visible = 0',
      [id]
    );

    // Verificar si algún post fue actualizado
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post no encontrado o ya visible.' });
    }

    res.status(200).json({ message: 'Visibilidad y estado del post actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la visibilidad y el estado del post:', error);
    res.status(500).json({ message: 'Error al actualizar la visibilidad y el estado del post.', error: error.message });
  }
};




// Actualizar estado de post a "rechazado"
export const rejectPost = async (req, res) => {
  const { id } = req.body; // Obtiene el ID del post desde el cuerpo de la solicitud
  try {
    const [result] = await pool.query(
      'UPDATE Posts SET estado = "rechazado" WHERE id = ? AND estado = "pendiente" AND visible = 0',
      [id]
    );

    // Verificar si algún post fue actualizado
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post no encontrado, ya rechazado, o no cumple con los criterios de actualización.' });
    }

    res.status(200).json({ message: 'Estado del post actualizado a "rechazado" correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el estado del post:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del post.', error: error.message });
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
