const repo = require('../repositories/materias.repository.js');

crearMateria = async (nombre, profesor, rolProfesor) => {
    return await repo.crearMateria(nombre, profesor, rolProfesor);
}

actualizarMateria = async (id, nombre, profesor, rolProfesor) => {
    const existe = await repo.existeMateria(id);
    
    if (!existe) {
        throw new Error('La materia no existe');
    }
    return await repo.actualizarMateria(id, nombre, profesor, rolProfesor);
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