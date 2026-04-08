const repo = require('../repositories/profe.repository');

exports.obtenerProfesores = async () => {
    const result = await repo.obtenerProfesores();
    if (result) {
        return result;
    } else {
        throw new Error('No se encontraron profesores');
    }
};

exports.crearProfesor = async (data) => {
    if (!data.nombre || !data.apellido) {
        throw new Error('Faltan campos obligatorios: nombre y apellido');
    }
    return await repo.crearProfesor(data);
};

exports.actualizarProfesor = async (id, data) => {
    const result = await repo.actualizarProfesor(id, data);
    if (result) {
        return result;
    } else {
        throw new Error('Profesor no encontrado');
    }
};

exports.eliminarProfesor = async (id) => {
    const eliminado = await repo.eliminarProfesor(id);
    if (eliminado) {
        return eliminado;
    } else {
        throw new Error('Profesor no encontrado');
    }
};

