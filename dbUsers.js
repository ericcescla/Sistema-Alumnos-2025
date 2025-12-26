const { Pool } = require('pg');
require('dotenv').config();

const poolUsuarios = new Pool({
  user: process.env.DB_USUARIOS_USER,
  host: process.env.DB_USUARIOS_HOST,
  database: process.env.DB_USUARIOS_NAME,
  password: process.env.DB_USUARIOS_PASS,
  port: process.env.DB_USUARIOS_PORT || 5432,
});
// Loguear cuando el pool establece una conexión
poolUsuarios.on('connect', () => {
  console.log('DB Usuarios: conexión establecida');
});

// Loguear errores del pool
poolUsuarios.on('error', (err) => {
  console.error('DB Usuarios: error en el pool', err);
});

// Prueba rápida de conexión al cargar el módulo
poolUsuarios.query('SELECT 1')
  .then(() => {
    console.log('DB Usuarios: prueba de conexión exitosa');
  })
  .catch((err) => {
    console.error('DB Usuarios: prueba de conexión fallida', err);
  });

module.exports = poolUsuarios;