const express = require('express');
const router = express.Router();
const controller = require('../controller/profe.controller.js');

router.get('/', controller.obtenerProfesores);
router.post('/', controller.crearProfesor);
router.put('/:id', controller.actualizarProfesor);
router.delete('/:id', controller.eliminarProfesor);
router.get('/export', controller.exportarProfesores);

module.exports = router;