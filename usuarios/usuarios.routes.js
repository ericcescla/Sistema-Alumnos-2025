const express = require('express');
const router = express.Router();
const controller = require('./usuarios.controller');
const {   passwordValidator,
  validarDatos,
  validarNuevaContraseña,
  validarErrores, } = require('./usuarios.milddleware');

router.post('/login', 
    validarDatos, 
    controller.login);

router.post(
  '/registro',
  validarDatos,
  passwordValidator,
  validarErrores,
  controller.registrar
);

module.exports = router;
