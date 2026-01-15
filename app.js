const express = require('express');
const app = express();
// const conexion = require('./test_db.js')

const cors = require('cors');
app.use(cors());

const path = require('path');


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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas de la app

const logsRouter = require('./log/logs.routes');
// const logsRouter = require('./routes/logs');
app.use('/api/logs', logsRouter);

const usuariosRouter = require('./usuarios/usuarios.routes');
// const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

//usamos la rutas refactorizadas pero sin testeo eric 
const alumnosRouter = require('./alumnos/alumnos.routes');
// const alumnosRouter = require('./routes/alumnos');
app.use('/alumnos', alumnosRouter);

const materiasRouter = require('./routes/materias');
app.use('/materias', materiasRouter);

const cursosRouter = require('./routes/cursos');
app.use('/cursos', cursosRouter);

const planesRouter = require('./routes/planes');
app.use('/planes', planesRouter);

const tutoresRouter = require('./routes/tutores');
app.use('/tutores', tutoresRouter);


// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
});