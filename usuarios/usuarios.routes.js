const express = require('express');
const router = express.Router();
const controller = require('./usuarios.controller');
const milddleware = require('./usuarios.milddleware');

router.get('/', controller.listarUsuarios);
router.get('/:id', controller.obtenerUsuario);

router.get('/grupos', controller.grupos);
router.get('/roles', controller.roles);
router.get('/usuarios-por-rol', controller.cargarUsuariosPorRol);
router.put('/:id/cambiar-grupo', controller.cambiarGrupo);
router.put('/:id/cambiar-rol', controller.cambiarRol);

router.put('/:id/habilitar', controller.habilitarUsuario);
router.put('/:id/desbloquear', controller.desbloquearUsuario);
router.put('/:id/deshabilitar', controller.deshabilitarUsuario);


module.exports = router;