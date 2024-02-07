import { pool } from "../db.js";
import multer from "multer";

// Configurar Multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const getVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Vehiculos");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM Vehiculos WHERE ID = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM Vehiculos WHERE ID = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const {
      Marca,
      Descripcion,
      Imagen,
      Modelo,
      Placa,
      AnioFabricacion,
      CapacidadCarga,
      TipoCombustible,
      EstadoVehiculo,
      KilometrajeActual,
    } = req.body;

    // Obtener la imagen desde la solicitud
    const image = req.file ? req.file.buffer : null;

    const [rows] = await pool.query(
      "INSERT INTO Vehiculos (Marca, Descripcion, Imagen, Modelo, Placa, AnioFabricacion, CapacidadCarga, TipoCombustible, EstadoVehiculo, KilometrajeActual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        Marca,
        Descripcion,
        image, // Guardar la imagen en el campo de tipo BLOB
        Modelo,
        Placa,
        AnioFabricacion,
        CapacidadCarga,
        TipoCombustible,
        EstadoVehiculo,
        KilometrajeActual,
      ]
    );

    res.status(201).json({ id: rows.insertId, ...req.body });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Marca,
      Descripcion,
      Imagen,
      Modelo,
      Placa,
      AnioFabricacion,
      CapacidadCarga,
      TipoCombustible,
      EstadoVehiculo,
      KilometrajeActual,
    } = req.body;

    // Obtener la imagen desde la solicitud
    const image = req.file ? req.file.buffer : null;

    // Utilizo una query con placeholders para evitar posibles SQL injection
    const [result] = await pool.query(
      "UPDATE Vehiculos SET Marca = IFNULL(?, Marca), Descripcion = IFNULL(?, Descripcion), Imagen = IFNULL(?, Imagen), Modelo = IFNULL(?, Modelo), Placa = IFNULL(?, Placa), AnioFabricacion = IFNULL(?, AnioFabricacion), CapacidadCarga = IFNULL(?, CapacidadCarga), TipoCombustible = IFNULL(?, TipoCombustible), EstadoVehiculo = IFNULL(?, EstadoVehiculo), KilometrajeActual = IFNULL(?, KilometrajeActual) WHERE ID = ?",
      [
        Marca,
        Descripcion,
        image, // Actualizar la imagen en el campo de tipo BLOB
        Modelo,
        Placa,
        AnioFabricacion,
        CapacidadCarga,
        TipoCombustible,
        EstadoVehiculo,
        KilometrajeActual,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vehicle not found" });

    const [rows] = await pool.query("SELECT * FROM Vehiculos WHERE ID = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return res.status(500).json({ message: "Error updating vehicle" });
  }
};

// Middleware para la subida de imágenes
export const uploadImage = upload.single("imagen");
