const express = require('express');
const router = express.Router();
const controller = require('./alumnos.controller');

router.get('/', controller.listarAlumnos);

router.get('/buscar', controller.buscarAlumno);

router.post('/', controller.crearAlumnoyTutor);

router.put('/:id', controller.actualizarAlumnoyTutor);

router.get('/buscarPorDni', controller.buscarAlumnoPorDniQuery);

// TODO route para eliminar un alumno y su tutor

module.exports = router;