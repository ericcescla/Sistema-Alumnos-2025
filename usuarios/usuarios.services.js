const repo = require('./usuarios.repository');
const { registrarLog } = require('../log/logs.repository');

async function login(usuario, password, ip) {
  const fechaActual = new Date();

  const result = await repo.findByUsuarioODni(usuario);
  if (result.rows.length === 0) {
    return { success: false, message: 'Usuario inexistente' };
  }

  const user = result.rows[0];

  // 2. Verificar estado administrativo
  if (user.deshabilitado) {
    await registrarLog(2, user.id_usuario, ip, 'Intento de login usuario deshabilitado');
    return { success: false, message: 'Usuario deshabilitado' };
  }

  if (user.bloqueado) {
    await registrarLog(3, user.id_usuario, ip, 'Intento de login de usuario bloqueado');
    return { success: false, message: 'Usuario bloqueado' };
  }

  // 3. Verificar credenciales
  if (user.pass !== password) {
    const sessionIntentos = user.intentos + 1;

    if (sessionIntentos >= 3) {
      await repo.bloquearUsuario(user.id_usuario, sessionIntentos);
      await registrarLog(5, user.id_usuario, ip, 'Usuario bloqueado por intentos fallidos');
      return { success: false, message: 'Usuario bloqueado' };
    }

    await repo.incrementarIntentos(user.id_usuario, sessionIntentos);
    await registrarLog(4, user.id_usuario, ip, 'contraseña incorrecta');
    return { success: false, message: 'contraseña incorrecta' };
  }

  // 4. Autenticación exitosa
  await repo.resetIntentos(user.id_usuario);
  await registrarLog(1, user.id_usuario, ip, 'Login exitoso!!');

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

async function roles() {
  const result = await repo.obtenerRoles();
  return result;
}

async function grupos() {
  const result = await repo.obtenerGrupos();
  return result;
}

// async function deshabilitarUsuario(req, res) {
//   try {
//     await repo.deshabilitarUsuario(req.params.id);
//     res.json({ success: true, message: 'Usuario deshabilitado correctamente' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error al deshabilitar usuario' });
//   }
// }

async function cargarUsuariosPorRol() {
  const result = await repo.obtenerUsuariosPorRol();
  return result;
}


function normalizarPaginacion({ page, limit }) {
  const MAX_LIMIT = 50;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(
    Math.max(parseInt(limit, 10) || 10, 1),
    MAX_LIMIT
  );

  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  };
}

function procesarBusqueda(search) {
  if (!search) return null;

  const value = search.trim();
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    return { type: 'dni', value };
  }

  return { type: 'nombre', value };
}

async function listarUsuarios(query) {
  const { page, limit, offset } = normalizarPaginacion(query);
  const search = procesarBusqueda(query.search);

  const { usuarios, total } =
    await repo.listarUsuarios({
      search,
      limit,
      offset
    });

  return {
    usuarios: usuarios,
    total: total
  };
}


module.exports = {
  login,
  registrar,
  grupos,
  roles,
  cargarUsuariosPorRol,
  listarUsuarios

};
