const repo = require('./tutor.repository');

async function buscarTutor(dni) {
    const result = await repo.buscarTutor(dni);
    return result;
}

async function obtenerTutores() {
    return await repo.obtenerTutores();
}

module.exports = {obtenerTutores, buscarTutor};