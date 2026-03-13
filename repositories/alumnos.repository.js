// const { Result } = require('pg');
const db = require('../dbDatos');

async function obtenerAlumnosAnioDivision(anio, division) {
  let query = `
    SELECT 
      a.*, 
      t.id_tutor, t.nombre AS tutor_nombre, t.apellido AS tutor_apellido,
      t.dni AS tutor_dni, t.cuil AS tutor_cuil, t.telefono AS tutor_telefono,
      t.email AS tutor_email, t.direccion AS tutor_direccion,
      c.anio, c.division, c.anio_lectivo
    FROM alumno a
    LEFT JOIN alumno_tutor at ON a.id_alumno = at.id_alumno
    LEFT JOIN tutor t ON at.id_tutor = t.id_tutor
    LEFT JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
    LEFT JOIN curso c ON ac.id_curso = c.id_curso
    WHERE c.anio_lectivo = TO_CHAR(CURRENT_DATE, 'YYYY')
  `;

  const params = [];
  let idx = 1;

  if (anio) {
    query += ` AND c.anio = $${idx}`;
    params.push(anio);
    idx++;
  }

  if (division) {
    query += ` AND c.division = $${idx}`;
    params.push(division);
    idx++;
  }

  query += ' ORDER BY a.id_alumno ASC';

  const result = await db.query(query, params);
  return result.rows;
}

async function buscarAlumnoPorDni(dni) {
  const result = await await db.query(
    `SELECT 
        a.*, t.id_tutor, t.nombre AS tutor_nombre, t.apellido AS tutor_apellido,
        t.dni AS tutor_dni, t.cuil AS tutor_cuil, t.telefono AS tutor_telefono,
        t.email AS tutor_email, t.direccion AS tutor_direccion
      FROM alumno a
      LEFT JOIN alumno_tutor at ON a.id_alumno = at.id_alumno
      LEFT JOIN tutor t ON at.id_tutor = t.id_tutor
      WHERE a.dni = $1
    `, [dni]);
  console.log("repo THIS IS BUSCAR ALUMNO POR DNI", result.rows[0]);

  return result.rows[0] || 0;
}

async function encontrarTutor(dni) {

  const resultado = await db.query(
    `SELECT * FROM tutor WHERE dni = $1`, [dni]
  );
  return resultado.rows[0] || 0;
}

async function crearAlumno(client, Alumno) {

  const nuevoAlumno = await client.query(
    `INSERT INTO alumno 
      (legajo, nombre, apellido, dni, cuil, email, direccion, link_docu, hermanos, fecha_nacimiento) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id_alumno`, [Alumno.legajo, Alumno.nombre, Alumno.apellido, Alumno.dni, Alumno.cuil, Alumno.email, Alumno.direccion, Alumno.link_docu, Alumno.hermanos, Alumno.fecha_nacimiento]);

  const id_alumno = nuevoAlumno.rows[0].id_alumno;

  return id_alumno;
}

async function crearTutor(client, Tutor) {
  const nuevoTutor = await client.query(
    `INSERT INTO tutor 
      (nombre, apellido, dni, cuil, telefono, email, direccion) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_tutor`
    , [Tutor.nombre, Tutor.apellido, Tutor.dni, Tutor.cuil, Tutor.telefono, Tutor.email, Tutor.direccion]);

  const id_tutor = nuevoTutor.rows[0].id_tutor;

  return id_tutor;
}

async function vincularAlumnoTutor(client, id_alumno, id_tutor) {
  await client.query(
    `INSERT INTO alumno_tutor (id_alumno, id_tutor) VALUES ($1, $2)`,
    [id_alumno, id_tutor]
  );
}

async function actualizarAlumno(client, data) {
  await client.query(
    `UPDATE alumno 
     SET legajo = $1, nombre = $2, apellido = $3, dni = $4, cuil = $5, email = $6, direccion = $7, link_docu = $8, hermanos = $9, fecha_nacimiento = $10
     WHERE id_alumno = $11`,
    [data.legajo, data.nombre, data.apellido, data.dni, data.cuil, data.email, data.direccion, data.link_docu, data.hermanos, data.fecha_nacimiento, data.id_alumno]
  );

}

async function actualizarTutor(client, data) {
  console.log('REPO' + data);
  
  await client.query(
    `UPDATE tutor 
     SET nombre = $1, apellido = $2, dni = $3, cuil = $4, telefono = $5, email = $6, direccion = $7
     WHERE id_tutor = $8`,
    [data.tutor_nombre, data.tutor_apellido, data.tutor_dni, data.tutor_cuil, data.tutor_telefono, data.tutor_email, data.tutor_direccion, data.tutor_id]
  );
}

module.exports = {
  obtenerAlumnosAnioDivision,
  buscarAlumnoPorDni,
  crearAlumno,
  crearTutor,
  vincularAlumnoTutor,
  encontrarTutor,
  actualizarAlumno,
  actualizarTutor
}

