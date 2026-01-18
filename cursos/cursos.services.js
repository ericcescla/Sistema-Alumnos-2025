const repo = require('./cursos.repository');

async function obtenerCursos() {
    const result = await repo.obternerCursos();
    return result.rows;
}

async function crearCurso(anio, division, id_plan, anio_lectivo) {
    const existe = await repo.findCursoExistente(
        anio, division, id_plan, anio_lectivo
    );

    if (existe.rows) {
        throw new Error(`El curso ${anio}${division} del año ${anio_lectivo} ya existe`);
    }

    await repo.crearCurso(anio, division, id_plan, anio_lectivo);

    return "Curso insertado correctamente";
}


async function alumnosPorCurso(anioLectivo, anio, division) {
    const result = await repo.alumnosPorCurso(anioLectivo, anio, division);
    return result.rows;
}

module.exports = {
    obtenerCursos, crearCurso, alumnosPorCurso 
}