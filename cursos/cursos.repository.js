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


module.exports = {
  obternerCursos,
  crearCurso,
  alumnosPorCurso,
  findCursoExistente
}