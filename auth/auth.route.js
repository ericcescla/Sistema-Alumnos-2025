const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const milddleware = require('../usuarios/usuarios.milddleware');

router.post('/login',
  controller.login
);

router.post(
  '/registrar',
  milddleware.validarDatos,
  milddleware.passwordValidator,
  milddleware.validarErrores,
  controller.registrar
);

router.put(
  '/:id/cambiar-password',
  milddleware.validarNuevaContraseña,
  milddleware.validarErrores,
  controller.cambiarPassword
);

router.get('/logout', async (req,res) =>{
   res.sendStatus(200);
});

module.exports = router;