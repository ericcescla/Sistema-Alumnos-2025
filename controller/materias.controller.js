const service = require('../service/materias.service.js');

crearMateria = async (req, res) => {
    try{
        const { nombre, profesor, rolProfesor, idCurso } = req.body;
        const resultado = await service.crearMateria(nombre, profesor, rolProfesor, idCurso);
        res.status(201).json(resultado);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al crear materia'});
    }
}

actualizarMateria = async (req, res) => {
    try{
        const { id } = req.params;
        const { nombre, profesor, rolProfesor, idCurso } = req.body;
        const resultado = await service.actualizarMateria(id, nombre, profesor, rolProfesor, idCurso);
        res.json(resultado);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar materia'});
    }
}

eliminarMateria = async (req, res) => {
    try{
        const { id } = req.params;
        const resultado = await service.eliminarMateria(id);
        res.json(resultado);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar materia'});
    }
}

obtenerMaterias = async (req, res) => {
    try{
        const resultado = await service.obtenerMaterias();
        res.json(resultado);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener materias'});
    }
}

module.exports = {
    obtenerMaterias,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}