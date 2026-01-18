const express = require('express');
const router = express.Router();
const controller = require('./logs.controller');
const db = require('../dbUsers')

router.get('/', controller.obternerLogs);
router.get('/ultimos', controller.ultimosLogs);
router.post('/', controller.hacerLog);

module.exports = router;