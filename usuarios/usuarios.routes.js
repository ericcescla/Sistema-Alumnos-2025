const express = require('express');
const router = express.Router();
const controller = require('./usuarios.controller');
const { passwordValidator,
  validarDatos,
  validarNuevaContraseña,
  validarErrores, } = require('./usuarios.milddleware');
// const service = require("./usuarios.services");


router.post('/login',
  controller.login);

router.post(
  '/registrar',
  validarDatos,
  passwordValidator,
  validarErrores,
  controller.registrar
);

router.get(
  '/grupos',
  controller.grupos

);

router.get(
  '/roles',
  controller.roles
)

router.get(
  '/usuarios-por-rol',
  controller.cargarUsuariosPorRol
);

router.get('/',
  controller.listarUsuarios);

module.exports = router;
