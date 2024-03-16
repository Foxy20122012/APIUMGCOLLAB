import { pool } from "../../../db.js";

export const executeSP = async (spName, params = []) => {
    const connection = await pool.getConnection();
  
    try {
      // Si no hay parámetros, llama al procedimiento almacenado sin paréntesis
      const query = params.length > 0 ? `CALL ${spName}(${params.map(() => '?').join(', ')})` : `CALL ${spName}`;
      const [rows, fields] = await connection.execute(query, params);
      return rows;
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
    res.status(200).json({ data: result });
    console.log('Resultado de la ejecución del procedimiento almacenado:', result);
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error en la API', details: error.message, stack: error.stack });
  }
};
