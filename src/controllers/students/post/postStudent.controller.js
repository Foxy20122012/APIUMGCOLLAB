import { pool } from '../../../db.js';
import jwt from 'jsonwebtoken';



const secretKey = "4a5b9f8c67eafcd2d3b1e5270a84e6f1"; // Debes definir una clave secreta para la verificación del token

export const getPostsByUser = async (req, res) => {
    try {
        // Obtener el token del header de autorización
        const token = req.headers.authorization?.split(' ')[1];
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sIjoidXN1YXJpbyIsImlhdCI6MTcxMTMyNDA2OH0.5FnutgL3J5gi4-LcBRZTvY1t4Xy4q39ZBnJX9Mx4Ua8";

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verificar el token
        const decoded = jwt.verify(token, secretKey);

        // Verificar que el token ha sido decodificado correctamente
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Asumiendo que el token decodificado contiene el id del usuario
        const userId = decoded.id;

        const [Posts] = await pool.query(`
            SELECT 
                id,
                titulo,
                contenido,
                estado,
                visible,
                fecha_creacion,
                fecha_actualizacion,
                usuario_id,
                curso_id,
                nombre
            FROM 
            Posts
            WHERE 
                usuario_id = ?
        `, [userId]);

        res.json(Posts);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const createPost = async (req, res) => {
    try {
        // Obtener el token del header de autorización
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1]; // Extraer el token de la cabecera
        if (!token) {
            return res.status(401).json({ message: "Token is not complete" });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id;
        const userRole = decoded.rol;

        // Extraer los datos del post desde el cuerpo de la solicitud
        const { titulo, contenido, nombre } = req.body;

        // Definir el estado inicial del post
        let estado = null;

        // Verificar si el rol del usuario es "superadmin" o "administrador" para cambiar el estado a "aprobado"
        if (userRole == 'superadmin' || userRole == 'administrador') {
            estado = 'aprobado';
        } else {
            estado = 'pendiente';
        }

        // Insertar el nuevo post en la base de datos
        const [result] = await pool.query(`
            INSERT INTO Posts (titulo, contenido, usuario_id, nombre, estado)
            VALUES (?, ?, ?, ?, ?)
        `, [titulo, contenido, userId, nombre, estado]); // No es necesario incluir 'visible' porque la BD les asigna valores por defecto

        // Devolver una respuesta con el post creado
        res.status(201).json({
            id: result.insertId,
            titulo,
            contenido,
            estado,
            visible: 1, // Valor por defecto según la estructura de la tabla
            usuario_id: userId,
            nombre
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
        console.error('Error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};




export const updatePost = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del post desde los parámetros de la ruta
        const { titulo, contenido, nombre } = req.body; // Obtener los datos actualizados del cuerpo de la solicitud

        // Aquí podrías verificar si el post pertenece al usuario con el ID 'userId' antes de permitir la actualización.
        // Si no pertenece, podrías retornar un error 403 (Forbidden).

        // Actualizar el post en la base de datos
        const [result] = await pool.query(`
            UPDATE Posts 
            SET titulo = ?, contenido = ?, nombre = ?
            WHERE id = ? 
        `, [titulo, contenido, nombre, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found or no changes made" });
        }

        // Devolver una respuesta confirmando la actualización
        res.json({
            message: "Post updated successfully",
            postId: id,
            titulo,
            contenido,
            nombre
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error('Error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params; // ID del post a eliminar
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id;

        // Aquí puedes añadir una verificación para asegurarte de que el usuario tiene permisos para eliminar el post
        // Por ejemplo, verificar si el post pertenece al usuario o si el usuario tiene un rol específico

        const [result] = await pool.query(`
            DELETE FROM Posts WHERE id = ? AND usuario_id = ?
        `, [id, userId]);

        if (result.affectedRows === 0) {
            // Si no se encontró el post o no pertenece al usuario, devolver un error
            return res.status(404).json({ message: "Post not found or not owned by user" });
        }

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        // Otros manejos de error aquí...
        console.error('Error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
