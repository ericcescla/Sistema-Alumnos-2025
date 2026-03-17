const express = require('express');
const router = express.Router();
const controller = require('../controller/cursos.controller.js');

router.get('/', controller.obtenerCursos);
router.get('/alumnosCurso', controller.alumnosPorCursos);
router.get('/:id', controller.cursoIndividual);
router.put('/:id', controller.actualizarCurso);
router.delete('/:id', controller.eliminarCurso);
router.post('/', controller.crearCursos);
router.post('/asignar-curso', controller.asignarCurso);

router.get('/cursos/:idCurso', controller.materiasPorCurso);

module.exports = router;
