const repo = require('./cursos.repository');

async function obtenerCursos() {
    const result = await repo.obternerCursos();
    return result.rows;
}

async function crearCurso(anio, division, id_plan, anio_lectivo) {
    const { rows } = await repo.findCursoExistente(
        anio_lectivo, anio, division,
    );

    if (rows[0].exists) {
        throw new Error(`El curso ${anio}${division} del año ${anio_lectivo} ya existe`);
    }


    await repo.crearCurso(anio, division, id_plan, anio_lectivo);

    return "Curso insertado correctamente";
}


async function alumnosPorCurso(anioLectivo, anio, division) {
    const result = await repo.alumnosPorCurso(anioLectivo, anio, division);
    return result.rows;
}
async function obtenerAlumnosSinCurso(anioLectivo) {
  return await repo.obtenerAlumnosSinCurso(anioLectivo);
}

async function asignarAlumnoACurso(id_alumno, anio, division, anio_lectivo) {
  return await repo.asignarAlumnoACurso(id_alumno, anio, division, anio_lectivo);
}

async function asignarAlumnosMasivamente(alumnos, anio, division, anio_lectivo) {
  return await repo.asignarAlumnosMasivamente(alumnos, anio, division, anio_lectivo);
}
async function obtenerInfoCurso(anio, division, anioLectivo) {
  return await repo.obtenerInfoCurso(anio, division, anioLectivo);
}
module.exports = {
    obtenerCursos, crearCurso, alumnosPorCurso, obtenerAlumnosSinCurso, asignarAlumnoACurso, asignarAlumnosMasivamente, obtenerInfoCurso
}