const { Pool } = require('pg');
require('dotenv').config();

const poolDatos = new Pool({
  user: process.env.DB_DATOS_USER,
  host: process.env.DB_DATOS_HOST,
  database: process.env.DB_DATOS_NAME,
  password: process.env.DB_DATOS_PASS,
  port: process.env.DB_DATOS_PORT || 5432,
});

// Loguear cuando el pool establece una conexión
poolDatos.on('connect', () => {
  console.log('DB Alumonos: conexión establecida');
});

// Loguear errores del pool
poolDatos.on('error', (err) => {
  console.error('DB alumnos: error en el pool', err);
});

// Prueba rápida de conexión al cargar el módulo
poolDatos.query('SELECT 1')
  .then(() => {
    console.log('DB alumnos: prueba de conexión exitosa');
  })
  .catch((err) => {
    console.error('DB alumnos: prueba de conexión fallida', err);
  });

module.exports = poolDatos;