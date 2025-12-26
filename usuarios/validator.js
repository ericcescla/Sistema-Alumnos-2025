// const { body } = require('express-validator');
const { body, validationResult } = require('express-validator');


const passwordValidator = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('La contraseña debe tener entre 8 y 16 caracteres')
  .matches(/[A-Z]/)
  .withMessage('Debe contener al menos una mayúscula')
  .matches(/[a-z]/)
  .withMessage('Debe contener al menos una minúscula')
  .matches(/[0-9]/)
  .withMessage('Debe contener al menos un número')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Debe contener un carácter especial');


const validarDatos = [
  body('nombre')
    .notEmpty().withMessage('Nombre requerido'),

  body('dni')
    .notEmpty().withMessage('DNI requerido')
    .isNumeric().withMessage('DNI inválido'),

  body('id_rol')
    .isInt({ min: 1 }).withMessage('Rol inválido'),

  body('id_grupo')
    .isInt({ min: 1 }).withMessage('Grupo inválido'),

];

const validarNuevaContraseña = [
   body('nuevaPassword')
   .notEmpty().withMessage('nueva contraseña require'),
];

const passwordValidatorContrseañaNueva = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('La contraseña debe tener entre 8 y 16 caracteres')
  .matches(/[A-Z]/)
  .withMessage('Debe contener al menos una mayúscula')
  .matches(/[a-z]/)
  .withMessage('Debe contener al menos una minúscula')
  .matches(/[0-9]/)
  .withMessage('Debe contener al menos un número')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Debe contener un carácter especial');

module.exports = {
  passwordValidatorContrseañaNueva
}