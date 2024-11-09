import { Router } from "express";
import { getDashboardMetrics } from "../../../controllers/general/profile/dashboard/dashboard.controller.js";

const router = Router();

// Ruta para obtener las métricas del dashboard
router.get("/dashboard/metrics", getDashboardMetrics);

export default router;
