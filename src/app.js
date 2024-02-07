import express from "express";
import morgan from "morgan";
import cors from "cors";

import employeesRoutes from "./routes/employees.routes.js";
import vehiclesRoutes from "./routes/vehicles.routes.js"
import mantenimientoVehiculosRoutes from "./routes/mantenimientoVehiculos.routes.js";
import indexRoutes from "./routes/index.routes.js";
import dataRoute from './routes/spr.routes.js';



const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api",dataRoute);
app.use("/", indexRoutes);
app.use("/api", employeesRoutes);
app.use("/api", vehiclesRoutes);
app.use("/api", mantenimientoVehiculosRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
