const express = require('express');
const router = express.Router();
const controller = require('./cursos.controller');

router.get('/', controller.obtenerCursos);
router.post('/', controller.crearCursos);
router.get('/alumnosCurso', controller.alumnosPorCursos);
// router.put('/asignar-curso/:id/:id', controller.asignarCurso)

module.exports = router;