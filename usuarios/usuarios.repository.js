const db = require("../dbUsers.js");

function findByUsuarioODni(valor) {
  return db.query(
    `
    SELECT u.*, r.nombre AS rol
    FROM usuarios u
    LEFT JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.nombre = $1 OR u.dni = $1
    LIMIT 1
  `,
    [valor]
  );
}

function resetIntentos(id) {
  return db.query(`UPDATE usuarios SET intentos = 0 WHERE id_usuario = $1`, [
    id,
  ]);
}

function incrementarIntentos(id, intentos) {
  return db.query(
    "UPDATE usuarios SET intentos = $1, bloqueado = $2 WHERE id_usuario = $3",
    [intentos, intentos >= 3, id]
  );
}

function crearUsuario(data) {
  return db.query(
    `
    INSERT INTO usuarios (nombre, pass, dni, id_rol, id_grupo, deshabilitado, bloqueado, intentos)
    VALUES ($1,$2,$3,$4,$5,false,false,0)
    RETURNING id_usuario
  `,
    data
  );
}

function obtenerPassHist(id_usuario){
  return db.query(`SELECT fecha_cambio FROM pass_historica WHERE id_usuario = $1 ORDER BY fecha_cambio DESC LIMIT 1`,[id_usuario]);
}

function insertarPassHisto(idUsuario, password){
  return db.query(`INSERT INTO pass_historica (id_usuario, pass_ult, fecha_cambio) VALUES ($1, $2, NOW())`);
}

function obtenerRoles() {
  return db.query(`SELECT id_rol, nombre FROM roles ORDER BY nombre`);
}

function obtenerGrupos() {
  return db.query(`SELECT id_rol, nombre FROM roles ORDER BY nombre`);
}

function deshabilitarUsuario() {
  return db.query(`UPDATE usuarios SET deshablitado = true WHERE id_usuario = $1`, [req.params.id]);
}  

function existeDni(){
   db.query(
      `SELECT id_usuario FROM usuarios WHERE dni = $1 LIMIT 1`, [dni]
    );
}
module.exports = {
  findByUsuarioODni,
  resetIntentos,
  incrementarIntentos,
  crearUsuario,
  obtenerGrupos,
  obtenerRoles,
  deshabilitarUsuario,
  obtenerPassHist,
  existeDni,
  insertarPassHisto
};
