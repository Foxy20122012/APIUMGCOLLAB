import { Router } from "express";
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
  uploadImage,
} from "../controllers/vehicles.controller.js";

const router = Router();

// GET all Vehicles
router.get("/vehicles", getVehicles);

// GET A Vehicle
router.get("/vehicles/:id", getVehicle);

// DELETE A Vehicle
router.delete("/vehicles/:id", deleteVehicle);

// INSERT A Vehicle with image upload
router.post("/vehicles", uploadImage, createVehicle);

// UPDATE A Vehicle with image upload
router.patch("/vehicles/:id", uploadImage, updateVehicle);

export default router;
