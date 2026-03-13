const express = require('express');
const router = express.Router();
const controller = require('../controller/materias.controller.js');

router.get('/', controller.obtenerMaterias);
router.post('/', controller.crearMateria);
router.put('/:id', controller.actualizarMateria);
router.delete('/:id', controller.eliminarMateria);

module.exports = router;