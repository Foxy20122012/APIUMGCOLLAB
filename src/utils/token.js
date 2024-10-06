// src/utils/token.js

import jwt from 'jsonwebtoken';
import { NODE_ENV } from '../config.js'; // Asegúrate de tener esta configuración

const JWT_SECRET = process.env.JWT_SECRET || '4a5b9f8c67eafcd2d3b1e5270a84e6f1'; // Puedes ajustar el secreto si es necesario

// Middleware para extraer el usuario del token
export const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;

  // Si no hay token, retorna null
  if (!authHeader) {
    console.error('No token provided');
    return null;
  }

  // Si hay un token, decodificarlo
  try {
    const token = authHeader.split(' ')[1]; // Asumiendo que el formato es "Bearer TOKEN"
    const decoded = jwt.verify(token, JWT_SECRET);

    // Retorna los datos del usuario extraídos del token
    return {
      id_usuario: decoded.id_usuario,
      nombre_usuario: decoded.nombre_usuario
    };
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return null; // Devuelve null si no se puede verificar el token
  }
};
