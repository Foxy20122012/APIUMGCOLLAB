import swaggerAutogen from 'swagger-autogen';

const swaggerAutogenSetup = swaggerAutogen();

const doc = {
  info: {
    title: 'Documentación API',
    description: 'API para la plataforma educativa',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  tags: [
    { name: 'SPR Routes', description: 'Rutas relacionadas con SPR' },
    { name: 'Admin Routes', description: 'Rutas de administración de cursos y tópicos' },
    { name: 'Auth Routes', description: 'Rutas de autenticación de usuarios y administradores' },
    { name: 'General Routes', description: 'Rutas generales de la aplicación' },
    { name: 'Visitor Routes', description: 'Rutas para visitantes' },  // Nueva sección para visitantes
    { name: 'Student Routes', description: 'Rutas para estudiantes' },  // Nueva sección para estudiantes
    { name: 'Teacher Routes', description: 'Rutas para catedráticos' }  // Nueva sección para catedráticos
  ],
};

const outputFile = 'swagger_output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogenSetup(outputFile, endpointsFiles).then(() => {
  import('./index.js');
});
