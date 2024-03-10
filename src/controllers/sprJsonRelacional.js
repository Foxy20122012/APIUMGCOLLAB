import { pool } from "../db.js";

export const executeSP = async (spName, params) => {
  const connection = await pool.getConnection();

  try {
    // Ejecutar el Stored Procedure.
    const [rows, fields] = await connection.execute(`CALL ${spName}(${params.map(() => '?').join(', ')})`, params);
    
    // Convertir todos los Buffers de tipo JSON en objetos JSON.
    const data = rows[0].map((row) => {
      const rowCopy = { ...row };
      if (rowCopy.data && Buffer.isBuffer(rowCopy.data)) {
        // Asumiendo que 'data' es la columna que contiene el JSON.
        rowCopy.data = JSON.parse(rowCopy.data.toString());
      }
      return rowCopy;
    });

    return data;
  } catch (error) {
    console.error('Error en la ejecución del Stored Procedure:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const spController = async (req, res) => {
  const { body } = req;

  if (!body || !body.spName || !body.params || !Array.isArray(body.params)) {
    return res.status(400).json({ error: 'Solicitud incorrecta' });
  }

  try {
    const result = await executeSP(body.spName, body.params);
    // Asegúrate de enviar solo el primer resultado si tu SP devuelve más de uno.
    res.status(200).json({ data: result[0] });
    console.log('Resultado de la ejecución del procedimiento almacenado:', result[0]);
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en la API', details: error.message });
  }
};
