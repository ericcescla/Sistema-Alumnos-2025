const express = require('express');
const router = express.Router();
const controller = require('./tutor.controller')

router.get('/', controller.obtenerTutores);
router.get('/buscar', controller.buscarTutor);

module.exports = router;