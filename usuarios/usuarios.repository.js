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

function bloquearUsuario(id, intentos) {
  return db.query(
    "UPDATE usuarios SET bloqueado = true, intentos = $1 WHERE id_usuario = $2",
    [intentos, id]
  );
}

function desbloquearUsuario(id) {
  return db.query("UPDATE usuarios SET bloqueado = false, intentos = 0 WHERE id_usuario = $1", [id]);
}

function crearUsuario(nombre, password, dni, id_rol, id_grupo) {
  return db.query(
    `
    INSERT INTO usuarios (nombre, pass, dni, id_rol, id_grupo, deshabilitado, bloqueado, intentos)
    VALUES ($1,$2,$3,$4,$5,false,false,0)
    RETURNING id_usuario
  `,
    [nombre, password, dni, id_rol, id_grupo]
  );
}

function obtenerPassHist(id_usuario){
  return db.query(`SELECT fecha_cambio FROM pass_historica WHERE id_usuario = $1 ORDER BY fecha_cambio DESC LIMIT 1`,[id_usuario]);
}

function insertarPassHisto(idUsuario, password){
  return db.query(`INSERT INTO pass_historica (id_usuario, pass_ult, fecha_cambio) VALUES ($1, $2, NOW())`, [idUsuario, password]);
}

function obtenerRoles() {
  return db.query(`SELECT id_rol, nombre FROM roles ORDER BY nombre`);
}

async function obtenerRoles() {
  const result = await db.query(`SELECT id_rol, nombre FROM roles ORDER BY nombre`);
  return result.rows;
}

async function obtenerGrupos() {
  const result = await db.query(`SELECT id_grupo, nombre FROM grupos ORDER BY nombre`);
  return result.rows;
}

function deshabilitarUsuario(id) {
  return db.query(`UPDATE usuarios SET deshabilitado = true WHERE id_usuario = $1`, [id]);
}

async function existeDni(dni){
   const result = await db.query(
      `SELECT id_usuario FROM usuarios WHERE dni = $1 LIMIT 1`, [dni]
    );
    return result.rows || 0;
}

async function obtenerUsuariosPorRol() {
  const result = await db.query(`
    SELECT r.nombre, COUNT(u.id_usuario)::int AS cantidad
    FROM roles r
    LEFT JOIN usuarios u ON r.id_rol = u.id_rol
    GROUP BY r.id_rol, r.nombre
    ORDER BY r.nombre
  `);

  return result.rows;
}

async function listarUsuarios({ search, limit, offset }) {
  let whereClause = '';
  let params = [];
  let paramIndex = 1;

  if (search) {
    if (search.type === 'dni') {
      whereClause = `WHERE u.dni = $${paramIndex}`;
      params.push(search.value);
      paramIndex++;
    }

    if (search.type === 'nombre') {
      whereClause = `WHERE u.nombre ILIKE $${paramIndex}`;
      params.push(`%${search.value}%`);
      paramIndex++;
    }
  }

  const sql = `
    SELECT
      u.id_usuario,
      u.nombre,
      u.dni,
      u.id_rol,
      r.nombre AS rol,
      u.id_grupo,
      g.nombre AS grupo,
      u.deshabilitado,
      u.bloqueado,
      u.intentos
    FROM usuarios u
    LEFT JOIN roles r ON u.id_rol = r.id_rol
    LEFT JOIN grupos g ON u.id_grupo = g.id_grupo
    ${whereClause}
    ORDER BY u.id_usuario
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const countSql = `
    SELECT COUNT(*)
    FROM usuarios u
    ${whereClause}
  `;

  const dataParams = [...params, limit, offset];

  const [usuariosResult, totalResult] = await Promise.all([
    db.query(sql, dataParams),
    db.query(countSql, params)
  ]);

  return {
    usuarios: usuariosResult.rows,
    total: parseInt(totalResult.rows[0].count, 10)
  };
}

function habilitarUsuario(id) {
  return db.query(`UPDATE usuarios SET deshabilitado = false WHERE id_usuario = $1`, [id]);
}

function cambiarGrupo(id, id_grupo) {
  return db.query(`UPDATE usuarios SET id_grupo = $1 WHERE id_usuario = $2`, [id_grupo, id]);
} 

function cambiarRol(id, id_rol){
  return db.query(`UPDATE usuarios SET id_rol = $1 WHERE id_usuario = $2`, [id_rol, id]);
}

async function cambiarPassword(nuevaPassword, id) {
  console.log('0repo', nuevaPassword, id);
console.log('db.query === pool.query ?', typeof db.query, db.query.length);
console.log(db.query.length);
console.log('DB identity:', require.resolve('../dbUsers.js'));
console.log('query length:', db.query.length);


  return await db.query(
     `UPDATE usuarios SET pass = $1 WHERE id_usuario = $2`,
    [nuevaPassword, id]
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
  insertarPassHisto,
  obtenerUsuariosPorRol,
  listarUsuarios,
  bloquearUsuario,
  habilitarUsuario,
  cambiarGrupo,
  cambiarRol,
  deshabilitarUsuario,
  desbloquearUsuario,
  cambiarPassword
};