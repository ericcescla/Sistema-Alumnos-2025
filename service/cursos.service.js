const repo = require('../repositories/cursos.repository.js');

cursoIndividual =  async (id) => {
    const curso = await repo.cursoIndividual(id);
    if (!curso) {
        throw new Error('Curso no encontrado');
    }
    const materias = await repo.materiasPorCurso(id, curso.id_plan);
    return { curso, materias };
}

async function obtenerCursos() {
    
    const { rows } = await repo.obternerCursos();
    return rows ;
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
    return result;
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
    obtenerCursos, crearCurso, alumnosPorCurso, asignarCurso, cursoIndividual
}
