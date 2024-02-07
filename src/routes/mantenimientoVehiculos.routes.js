import { Router } from "express";
import {
  createMantenimientoVehiculo,
  deleteMantenimientoVehiculo,
  getMantenimientoVehiculo,
  getMantenimientosVehiculos,
  updateMantenimientoVehiculo,
} from "../controllers/mantenimientoVehiculos.controller.js";

const router = Router();

// GET all Maintenance Records
router.get("/mantenimientosVehiculos", getMantenimientosVehiculos);

// GET A Maintenance Record
router.get("/mantenimientosVehiculos/:id", getMantenimientoVehiculo);

// DELETE A Maintenance Record
router.delete("/mantenimientosVehiculos/:id", deleteMantenimientoVehiculo);

// INSERT A Maintenance Record
router.post("/mantenimientosVehiculos", createMantenimientoVehiculo);

// UPDATE A Maintenance Record
router.patch("/mantenimientosVehiculos/:id", updateMantenimientoVehiculo);

export default router;
