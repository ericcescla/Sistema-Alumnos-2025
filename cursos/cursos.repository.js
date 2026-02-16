const db = require('../dbDatos');

async function obternerCursos() {

  return db.query(`
      SELECT 
        c.*, p.id_plan, p.nombre_plan AS nombre_plan, p.descripcion AS plan_descripcion
      FROM curso c
      LEFT JOIN plan p ON c.id_plan = p.id_plan
      ORDER BY c.id_curso ASC;
    `);

}

async function crearCurso(anio, division, id_plan, anio_lectivo) {

  return db.query(`INSERT INTO curso (anio, division, id_plan, anio_lectivo) VALUES ($1, $2, $3, $4)`,
    [anio, division, id_plan, anio_lectivo]);

}

async function alumnosPorCurso(anioLectivo, anio, division) {

  return db.query(`
   SELECT a.id_alumno, a.legajo, a.nombre, a.apellido, a.dni,
             c.anio, c.division, c.anio_lectivo
      FROM alumno a
      JOIN alumno_curso ac ON ac.id_alumno = a.id_alumno
      JOIN curso c ON c.id_curso = ac.id_curso
      WHERE c.anio_lectivo = $1
        AND c.anio = $2
        AND c.division = $3
      ORDER BY a.nombre;  
    `, [anioLectivo, anio, division]);

}

async function findCursoExistente(anioLectivo, anio, division) {

  return db.query(`
     SELECT EXISTS (
       SELECT 1
       FROM curso
       WHERE anio_lectivo = $1
       AND anio = $2
       AND division = $3
       );
    `, [anioLectivo, anio, division]);

}
async function obtenerAlumnosSinCurso(anioLectivo) {
  const query = `
    SELECT a.id_alumno, a.legajo, a.nombre, a.apellido, a.dni
    FROM alumno a
    WHERE NOT EXISTS (
      SELECT 1 
      FROM alumno_curso ac
      JOIN curso c ON ac.id_curso = c.id_curso
      WHERE ac.id_alumno = a.id_alumno
        AND c.anio_lectivo = $1
    )
    ORDER BY a.apellido, a.nombre;
  `;
  
  const result = await db.query(query, [anioLectivo]);
  return result.rows;
}

async function asignarAlumnoACurso(id_alumno, anio, division, anio_lectivo) {
  // Primero obtener el id_curso
  const cursoBuscado = await db.query(
    `SELECT id_curso FROM curso 
     WHERE anio = $1 AND division = $2 AND anio_lectivo = $3`,
    [anio, division, anio_lectivo]
  );

  if (cursoBuscado.rows.length === 0) {
    throw new Error('El curso especificado no existe');
  }

  const id_curso = cursoBuscado.rows[0].id_curso;

  // Verificar si ya está asignado
  const yaAsignado = await db.query(
    `SELECT 1 FROM alumno_curso 
     WHERE id_alumno = $1 AND id_curso = $2`,
    [id_alumno, id_curso]
  );

  if (yaAsignado.rows.length > 0) {
    throw new Error('El alumno ya está asignado a este curso');
  }

  // Asignar
  await db.query(
    `INSERT INTO alumno_curso (id_alumno, id_curso) 
     VALUES ($1, $2)`,
    [id_alumno, id_curso]
  );

  return { mensaje: 'Alumno asignado correctamente' };
}

async function asignarAlumnosMasivamente(alumnos, anio, division, anio_lectivo) {
  // Obtener el id_curso
  const cursoBuscado = await db.query(
    `SELECT id_curso FROM curso 
     WHERE anio = $1 AND division = $2 AND anio_lectivo = $3`,
    [anio, division, anio_lectivo]
  );

  if (cursoBuscado.rows.length === 0) {
    throw new Error('El curso especificado no existe');
  }

  const id_curso = cursoBuscado.rows[0].id_curso;

  // Insertar todos los alumnos (ignorar duplicados)
  const valores = alumnos.map((id_alumno, index) => {
    return `($${index * 2 + 1}, $${index * 2 + 2})`;
  }).join(', ');

  const params = alumnos.flatMap(id_alumno => [id_alumno, id_curso]);

  await db.query(
    `INSERT INTO alumno_curso (id_alumno, id_curso) 
     VALUES ${valores}
     ON CONFLICT DO NOTHING`,
    params
  );

  return { mensaje: `${alumnos.length} alumno(s) asignado(s) correctamente` };
}
async function obtenerInfoCurso(anio, division, anioLectivo) {
  const result = await db.query(`
    SELECT c.id_curso, c.anio, c.division, c.anio_lectivo, 
           p.nombre_plan, p.descripcion AS plan_descripcion
    FROM curso c
    JOIN plan p ON c.id_plan = p.id_plan
    WHERE c.anio = $1 AND c.division = $2 AND c.anio_lectivo = $3
  `, [anio, division, anioLectivo]);

  if (result.rows.length === 0) {
    throw new Error('Curso no encontrado');
  }

  return result.rows[0];
}

module.exports = {
  obternerCursos,
  crearCurso,
  alumnosPorCurso,
  findCursoExistente,
  obtenerAlumnosSinCurso,
  asignarAlumnoACurso,
  asignarAlumnosMasivamente,
  obtenerInfoCurso
}