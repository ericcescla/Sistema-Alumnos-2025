const db = require('../dbDatos');

cursoIndividual = async (id) => {
  const { rows } = await db.query(`
    SELECT 
      c.*,
      p.id_plan,
      p.nombre_plan,
      p.descripcion AS descripcion
    FROM curso c
    LEFT JOIN plan p ON c.id_plan = p.id_plan
    WHERE c.id_curso = $1
  `, [id]);
  return rows[0];
}

async function materiasPorCurso(idCurso, idPlan) {
  const queries = [
    {
      text: `
        SELECT m.id_materia, m.nombre_materia, m.profesor, m.rol_profesor
        FROM curso_materia cm
        JOIN materia m ON m.id_materia = cm.id_materia
        WHERE cm.id_curso = $1
        ORDER BY m.nombre_materia
      `,
      values: [idCurso]
    },
    {
      text: `
        SELECT m.id_materia, m.nombre_materia, m.profesor, m.rol_profesor
        FROM materia_curso mc
        JOIN materia m ON m.id_materia = mc.id_materia
        WHERE mc.id_curso = $1
        ORDER BY m.nombre_materia
      `,
      values: [idCurso]
    },
    {
      text: `
        SELECT id_materia, nombre_materia, profesor, rol_profesor
        FROM materia
        WHERE id_curso = $1
        ORDER BY nombre_materia
      `,
      values: [idCurso]
    }
  ];

  if (idPlan) {
    queries.push({
      text: `
        SELECT m.id_materia, m.nombre_materia, m.profesor, m.rol_profesor
        FROM plan_materia pm
        JOIN materia m ON m.id_materia = pm.id_materia
        WHERE pm.id_plan = $1
        ORDER BY m.nombre_materia
      `,
      values: [idPlan]
    });

    queries.push({
      text: `
        SELECT id_materia, nombre_materia, profesor, rol_profesor
        FROM materia
        WHERE id_plan = $1
        ORDER BY nombre_materia
      `,
      values: [idPlan]
    });
  }

  for (const query of queries) {
    try {
      const { rows } = await db.query(query.text, query.values);
      return rows;
    } catch (error) {
      if (error && (error.code === '42P01' || error.code === '42703')) {
        continue;
      }
      throw error;
    }
  }

  return [];
}

async function obternerCursos() {

  const result =  db.query(`
      SELECT 
        c.*, p.id_plan, p.nombre_plan AS nombre_plan, p.descripcion AS plan_descripcion
      FROM curso c
      LEFT JOIN plan p ON c.id_plan = p.id_plan
      ORDER BY c.id_curso ASC;
    `);
  
    return result;

}

async function crearCurso(anio, division, id_plan, anio_lectivo) {

  const { rows } = await db.query(`INSERT INTO curso (anio, division, id_plan, anio_lectivo) VALUES ($1, $2, $3, $4) RETURNING *`,
    [anio, division, id_plan, anio_lectivo]);
  return rows[0];
}




async function alumnosPorCurso(anioLectivo, anio, division) {

  const { rows } = await db.query(`
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
  return rows;
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

asignarCurso = async (idAlumno, idCurso) => {
  const result = await db.query(`
    INSERT INTO alumno_curso (id_alumno, id_curso)
    VALUES ($1, $2)
    RETURNING *;
  `, [idAlumno, idCurso]);

  return result.rows[0];
}

alumnoYaAsignado = async (idAlumno, idCurso) => {
  return db.query(`
    SELECT EXISTS (
      SELECT 1
      FROM alumno_curso
      WHERE id_alumno = $1
    );
  `, [idAlumno]);
}

cursoDeAlumno = async (idAlumno) => {
  return db.query(`
    SELECT c.*
    FROM curso c
    JOIN alumno_curso ac ON ac.id_curso = c.id_curso
    WHERE ac.id_alumno = $1
  `, [idAlumno]);
}
module.exports = {
  obternerCursos,
  crearCurso,
  alumnosPorCurso,
  findCursoExistente,
  asignarCurso,
  alumnoYaAsignado,
  cursoDeAlumno,
  cursoIndividual,
  materiasPorCurso
}
