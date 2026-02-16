const express = require('express');
const router = express.Router();
const controller = require('./logs.controller');
const db = require('../dbUsers')

router.get('/', controller.obternerLogs);
router.get('/ultimos', controller.ultimosLogs);
router.post('/', controller.hacerLog);

/* NUEVA RUTA: devuelve las operaciones (para poblar el select) */
router.get('/operaciones', controller.listarOperaciones);

module.exports = router;