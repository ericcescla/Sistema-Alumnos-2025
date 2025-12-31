const express = require('express');
const router = express.Router();
const controller = require('./usuarios.controller');
const { passwordValidator,
  validarDatos,
  validarNuevaContraseña,
  validarErrores, } = require('./usuarios.milddleware');

router.get('/',
  controller.listarUsuarios
);

router.post('/login',
  controller.login
);

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
);

router.get(
  '/usuarios-por-rol',
  controller.cargarUsuariosPorRol
);

router.put('/:id/cambiar-grupo', 
  controller.cambiarGrupo
);

router.put('/:id/cambiar-rol', 
  controller.cambiarRol
);

router.put('/:id/habilitar', 
  controller.habilitarUsuario
);

router.put('/:id/desbloquear',
  controller.desbloquearUsuario
);

router.put('/:id/deshabilitar',
  controller.deshabilitarUsuario
);

router.put(
  '/:id/cambiar-password',
  validarNuevaContraseña,
  validarErrores,
  controller.cambiarPassword
);

router.get('/logout', async (req,res) =>{
   res.sendStatus(200);
});

module.exports = router;