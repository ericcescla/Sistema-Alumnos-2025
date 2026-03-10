require('dotenv').config();
const logsRouter = require('./log/logs.routes');
const usuariosRouter = require('./usuarios/usuarios.routes');
const alumnosRouter = require('./alumnos/alumnos.routes');
const materiasRouter = require('./routes/materias');
const cursosRouter = require('./cursos/cursos.routes');
const planesRouter = require('./routes/planes');
const tutoresRouter = require('./tutor/tutor.route');
const authRouter = require('./auth/auth.route');
const authmilddleware  = require('./auth/auth.middleware');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Protege /api salvo /api/auth
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth')) return next();
  return authmilddleware.authenticateToken(req, res, next);
});

app.use(function(req, res, next) {
  if (!req.user) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  }
  next();
});

// Archivos estáticos
app.use('/assets', express.static('assets'));
app.use('/views', express.static('views'));
app.use('/services', express.static('services'));

// Ruta para servir index.html
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'index.html'))});
app.get('/login.html', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'login.html'))});

app.use('/api/auth', authRouter);


// Rutas de la app
app.use('/api/tutores',  tutoresRouter);
app.use('/api/planes',  planesRouter);
app.use('/api/cursos',  cursosRouter);
app.use('/api/materias',  materiasRouter);
app.use('/api/alumnos',  alumnosRouter);
app.use('/api/usuarios',  usuariosRouter);
app.use('/api/logs',  logsRouter);
// authmilddleware.estaAutorizado('Supervisor'),
// authmilddleware.estaAutorizado('Supervisor'),
// authmilddleware.estaAutorizado('Supervisor'),
// authmilddleware.estaAutorizado('Supervisor'),
// authmilddleware.estaAutorizado('Supervisor'),
// authmilddleware.estaAutorizado('Supervisor'),

module.exports = {app};
