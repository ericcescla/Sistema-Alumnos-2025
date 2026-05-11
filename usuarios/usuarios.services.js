const repo = require('./users.repository');
const { registrarLog } = require('../logs/logs.repository');

async function login(usuario, password, ip) {
  const fechaActual = new Date();

  // 1. Buscar usuario (sin revelar existencia)
  const result = await repo.findByUsuarioODni(usuario);
  if (result.rows.length === 0) {
    return { success: false, message: 'INVALID_CREDENTIALS' };
  }

  const user = result.rows[0];

  // 2. Verificar estado administrativo
  if (user.deshabilitado) {
    await registrarLog(2, user.id_usuario, ip, 'Intento de login usuario deshabilitado');
    return { success: false, message: 'USER_DISABLED' };
  }

  if (user.bloqueado) {
    await registrarLog(3, user.id_usuario, ip, 'Intento de login usuario bloqueado');
    return { success: false, message: 'USER_BLOCKED' };
  }

  // 3. Verificar credenciales
  if (user.pass !== password) {
    const sessionIntentos = user.intentos + 1;

    if (sessionIntentos >= 3) {
      await repo.bloquearUsuario(user.id_usuario, sessionIntentos);
      await registrarLog(5, user.id_usuario, ip, 'Usuario bloqueado por intentos fallidos');
      return { success: false, message: 'USER_BLOCKED' };
    }

    await repo.actualizarIntentos(user.id_usuario, sessionIntentos);
    await registrarLog(4, user.id_usuario, ip, 'Credenciales inválidas');
    return { success: false, message: 'INVALID_CREDENTIALS' };
  }

  // 4. Autenticación exitosa
  await repo.resetIntentos(user.id_usuario);
  await registrarLog(1, user.id_usuario, ip, 'Login exitoso');

  // 5. Políticas post-login (expiración de contraseña)
  const passHist = await repo.obtenerPassHist(user.id_usuario);

  let requiereCambioPassword = false;
  const seisMesesMs = 6 * 30 * 24 * 60 * 60 * 1000;

  if (passHist.rows.length > 0) {
    const fechaUltimoCambio = new Date(passHist.rows[0].fecha_cambio);
    if (fechaActual - fechaUltimoCambio > seisMesesMs) {
      requiereCambioPassword = true;
    }
  } else {
    requiereCambioPassword = true;
  }

  //si requiereCambioPassword es verdad 
  if (requiereCambioPassword) {
    return {
      success: false,
      message: 'La contraseña ha expirado. Debe cambiarla.',
      requiereCambioPassword: true,
      user: { id_usuario: user.id_usuario, nombre: user.nombre, rol: user.rol }
    }
  }
//si todo esta correcto seguimos con el flujo normal.
  return {
    success: true,
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      rol: user.rol
    }
  };
}

async function registrar(nombre, password, dni, id_rol, id_grupo) {
  const user = { nombre, password, dni, id_rol, id_grupo };

  const siExisteDni = await repo.existeDni(dni);

  if (siExisteDni.rows.length > 0) {
    return { success: false, message: 'dni ya existe en la base de dato' };
  }

  const insertUser = await repo.crearUsuario(user);

  const idUsuario = insertUser.rows[0].id_usuario;
  await repo.insertarPassHisto(idUsuario, user.password);
  await registrarLog(4, idUsuario, 'usuario fue creado');
  return { success: true, message: `Usuario creado exitosamente, `, id_usuario: idUsuario, nombre };

}
module.exports = {
  login,
  registrar
};
