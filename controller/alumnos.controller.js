const services = require('../service/alumnos.service.js');

async function listarAlumnos(req, res) {
  const { anio, division } = req.query; 
    try {
        const result = await services.obtenerAlumnos(anio, division);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
}

async function buscarAlumno(req, res) {
    const { dni } = req.query;
    try {
        const result = await services.buscarAlumnoPorDni(dni);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar alumno' });
    }
}

async function crearAlumnoyTutor(req, res) {
    try {
        
        const Alumno =  {
            legajo,
            nombre, 
            apellido, 
            dni,            
            cuil,
            email, 
            direccion, 
            link_docu, 
            hermanos, 
            fecha_nacimiento,
        } = req.body;
        const Tutor = {
            nombre:tutor_nombre, 
            apellido:tutor_apellido,
            dni:tutor_dni,
            cuil:tutor_cuil,
            telefono:tutor_telefono,
            email:tutor_email,
            direccion:tutor_direccion
        } = req.body;
tutor_telefono
        
        
        const message = await services.crearAlumnoyTutor(Alumno, Tutor);
        res.status(201).json(message);

    } catch (error) {
        console.error(error);
        res.status(201).json('error al insertar alumno y tutor',error);

    }
}

async function actualizarAlumnoyTutor(req, res) {
    try {
       const data = req.body;
        const message = await services.actualizarAlumnoyTutor(data);
        res.json(message);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar alumno y tutor' });
    }
}

module.exports = {
    listarAlumnos,
    buscarAlumno, 
    crearAlumnoyTutor, 
    actualizarAlumnoyTutor,
}