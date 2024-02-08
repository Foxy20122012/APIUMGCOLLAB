import express from "express";
import morgan from "morgan";
import cors from "cors";


import indexRoutes from "./routes/index.routes.js";
import dataRoute from './routes/spr.routes.js';
// import loginRoute from './routes/login.routes.js';
import linksRoute from './routes/links.routes.js';
import registerRoute from './routes/register.routes.js';
import loginAdminRoute from './routes/loginAdmin.routes.js';
import loginUsuarioRoute from './routes//loginUsuario.routes.js';

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Route universal routes
app.use("/api",dataRoute);

// Routes for the main page
app.use("/", indexRoutes);
// app.use("/api", loginRoute);
app.use('/api', linksRoute);

//Routes from login and register
app.use('/api', registerRoute );
app.use("/api", loginAdminRoute)
app.use("/api", loginUsuarioRoute);


app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
