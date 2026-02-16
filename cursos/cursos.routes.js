const express = require('express');
const router = express.Router();
const controller = require('./cursos.controller');

router.get('/', controller.obtenerCursos);
router.post('/', controller.crearCursos);
router.get('/alumnosCurso', controller.alumnosPorCursos);
router.get('/alumnos-sin-curso', controller.alumnosSinCurso); 
router.post('/asignar-individual', controller.asignarIndividual); 
router.post('/asignar-masiva', controller.asignarMasiva); 
router.get('/obtener-info', controller.obtenerInfoCurso);
module.exports = router;