const repo = require('../repositories/tutor.repositoty');

async function buscarTutor(dni) {
    const result = await repo.buscarTutor(dni);
    return result;
}

async function obtenerTutores() {
    return await repo.obtenerTutores();
}
