const db = require('../dbUsers.js');

async function registrarLog(idOperacion, idUsuario, ip, detalle, usuarioAfectado = null) {
  try {
    await db.query(`
      INSERT INTO logs (id_operacion, hora_y_fecha, id_usuario, mac, ip, detalle, usuario_afectado)
      VALUES ($1, NOW(), $2, NULL, $3, $4, $5)
    `, [idOperacion, idUsuario, ip || null, detalle, usuarioAfectado]);
  } catch (err) {
    console.error('Error registrando log:', err);
  }
}

module.exports = { registrarLog };
