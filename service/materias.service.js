const repo = require('../repositories/materias.repository.js');

crearMateria = async (nombre, profesor, rolProfesor, idCurso) => {
    return await repo.crearMateria(nombre, profesor, rolProfesor, idCurso);
}

actualizarMateria = async (id, nombre, profesor, rolProfesor, idCurso) => {
    const existe = await repo.existeMateria(id);
    
    if (!existe) {
        throw new Error('La materia no existe');
    }
    return await repo.actualizarMateria(id, nombre, profesor, rolProfesor, idCurso);
}

eliminarMateria = async (id) => {
    const existe = await repo.existeMateria(id);
    
    if (!existe) {
        throw new Error('La materia no existe');
    }
    return await repo.eliminarMateria(id);
}

obtenerMaterias = async () => {
    return await repo.obtenerMaterias();
}   




module.exports = {
    obtenerMaterias,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}