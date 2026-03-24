const service = require('../service/profe.service.js');

exports.obtenerProfesores = async (req, res) => {
    try {
        const profesores = await service.obtenerProfesores();
        res.json(profesores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener profesores' });
        console.error('Error al obtener profesores:', error);   
    }
};

exports.crearProfesor = async (req, res) => {
    try {
        const nuevoProfesor = await service.crearProfesor(req.body);
        res.status(201).json(nuevoProfesor);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear profesor' });
        console.error('Error al obtener profesores:', error);   

    }
};

exports.actualizarProfesor = async (req, res) => {
    try {

        const profesorActualizado = await service.actualizarProfesor(req.params.id, req.body);  
        return profesorActualizado;

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar profesor' });
        console.error('Error al obtener profesores:', error);   

    }
};

exports.eliminarProfesor = async (req, res) => {
    try {
        const eliminado = await service.eliminarProfesor(req.params.id);
        return eliminado;
       
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar profesor' });
        console.error('Error al obtener profesores:', error);
    }
};

