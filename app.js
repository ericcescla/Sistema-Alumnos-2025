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

// Ruta para servir index.html
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'index.html'))});

app.use('/api/auth', authRouter);


// Rutas de la app
app.use('/api/tutores', authmilddleware.estaAutorizado("Administrador",
"Auditor",
"Invitado",
"Operador",
"Soporte",
"Supervisor",
"Usuario")
, tutoresRouter);
app.use('/api/planes', authmilddleware.estaAutorizado('Supervisor'), planesRouter);
app.use('/api/cursos', authmilddleware.estaAutorizado('Supervisor'), cursosRouter);
app.use('/api/materias', authmilddleware.estaAutorizado('Supervisor'), materiasRouter);
app.use('/api/alumnos', authmilddleware.estaAutorizado('Supervisor'), alumnosRouter);
app.use('/api/usuarios', authmilddleware.estaAutorizado('Supervisor'), usuariosRouter);
app.use('/api/logs', authmilddleware.estaAutorizado('Supervisor'), logsRouter);


module.exports = {app};
