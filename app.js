const logsRouter = require('./log/logs.routes');
const usuariosRouter = require('./usuarios/usuarios.routes');
const alumnosRouter = require('./alumnos/alumnos.routes');
const materiasRouter = require('./routes/materias');
const cursosRouter = require('./cursos/cursos.routes');
const planesRouter = require('./routes/planes');
const tutoresRouter = require('./tutor/tutor.route');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());

// Para eliminar el cache y que no se pueda volver con el boton de back luego de que hacemos un LOGOUT
app.use(function(req, res, next) {
  if (!req.user) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  }
  next();
});

// ✅ Middlewares para leer cuerpo de las peticiones
app.use(express.json()); // Para fetch con JSON
app.use(express.urlencoded({ extended: true })); // Para formularios HTML clásicos

// Archivos estáticos
app.use('/assets', express.static('assets'));
app.use('/views', express.static('views'));

// Ruta para servir index.html
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'index.html'));});

// Rutas de la app
app.use('/api/tutores', tutoresRouter);
app.use('/api/planes', planesRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/materias', materiasRouter);
app.use('/api/alumnos', alumnosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/logs', logsRouter);



// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
});