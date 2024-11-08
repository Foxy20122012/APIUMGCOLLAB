import express from "express";
import morgan from "morgan";
import cors from "cors";//Cors encabezados http. Permite solicitar recursos restringidos en una página web desde un dominio diferente del dominio que sirvió el primer recurso

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../swagger_output.json'assert { type: 'json' };


import indexRoutes from "./routes/index.routes.js";//Ruta principal de bievenida
import dataRoute from './routes/spr/sprParams/spr.routes.js';//Ruta para consultas con Spr
import dataJsonRoute from "./routes/spr/sprJsonRelacional.routes.js"
import registerRoute from './routes/register/register.routes.js';//Endpoint para registrarse

import linksRoute from './routes/links/links.routes.js';
 import adminSessionRoute from './routes/login/login.routes.js'; //((Endpoint para la login del administrador))

import loginAdminRoute from './routes/login/loginAdmin.routes.js';//Endpoint para la login del administrador
import loginUsuarioRoute from './routes/login/loginUsuario.routes.js';//Endpoint para login de los usuarios
//Registro de rutas Admin
import cursosRoute from "./routes/admin/courses/cursos.routes.js"//Endpoint del administrador para administrar los cursos
import i18nRoute from "./routes/spr/i18n/sprI18n.routes.js"//Endpoint del admin en desarrollo para administrar el i18n
import topicsRoute from "./routes/admin/topics/topics.routes.js"
import categoryRoute from "./routes/admin/categorys/category.routes.js"
import newsCategoryRoute from "./routes/admin/categorys/NewsCategory.routes.js"
import EventDetailsRoute from "./routes/admin/categorys/Events.routes.js"
import RegisterCatedraticosRoute from "./routes/admin/registerProfessors/registerProfessors.routes.js"
import RegisterStudentRoute from "./routes/admin/registerStudent/registerStudent.routes.js"
import PostsRoute from "./routes/general/post/post/posts.routes.js"//Endpoint para los post

//Post student
//import postStudentRoute from "./routes/students/postStudent/postStudent.routes.js"

//Router profile user
import getProfileUserRoute from "./routes/general/profile.routes.js"
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());//Permite usar los encabezados para transmision de datos por medio de http por medio de los navegadores
app.use(express.json());


// Usa Swagger UI con el archivo JSON generado automáticamente
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route universal routes Stored Procedured
app.use("/api",dataRoute);
app.use("/api", i18nRoute)

//Routes related to the session
app.use("/api", adminSessionRoute)

//Routes related to courses
app.use("/api", dataJsonRoute)

//Routes admin
app.use("/api", cursosRoute)
app.use("/api", topicsRoute)
app.use("/api", categoryRoute)
app.use("/api", newsCategoryRoute)
app.use("/api", EventDetailsRoute)

// Routes for the main page
app.use("/", indexRoutes);
// app.use("/api", loginRoute);
app.use('/api', linksRoute);

//Routes from login and register
app.use('/api', registerRoute );
app.use("/api", loginAdminRoute)
app.use("/api", loginUsuarioRoute);
app.use("/api", RegisterCatedraticosRoute);
app.use("/api", RegisterStudentRoute);

//Route Student
//app.use("/api", postStudentRoute );//Route Post Student

//Route Profile User
app.use("/api", getProfileUserRoute);
app.use("/api", PostsRoute)




app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
