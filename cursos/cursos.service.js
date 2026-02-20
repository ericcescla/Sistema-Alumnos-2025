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
    if (result.rows.length === 0) {
        throw new Error("No hubo concidencia con lo datos");
        
    }
    return result.rows;
}


asignarCurso = async (idAlumno, idCurso) => {
    const { rows } = await repo.alumnoYaAsignado(idAlumno, idCurso);

    if (rows[0].exists) {
        throw new Error("El alumno ya esta asignado a un curso");
    }

    const result = await repo.asignarCurso(idAlumno, idCurso);
    console.log(result);
    
    return "Curso asignado correctamente";
}

module.exports = {
    obtenerCursos, crearCurso, alumnosPorCurso, asignarCurso
}