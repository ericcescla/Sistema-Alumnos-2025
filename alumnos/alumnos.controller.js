const services = require('./alumnos.service');

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
        const {
            legajo, nombre, apellido, dni, cuil, email, direccion,
            link_docu, hermanos, fecha_nacimiento,
            tutor_nombre, tutor_apellido, tutor_dni, tutor_cuil,
            tutor_telefono, tutor_email, tutor_direccion
        } = req.body;

        const Alumno = {
            legajo, nombre, apellido, dni, cuil, email, direccion,
            link_docu, hermanos, fecha_nacimiento
        };

        const Tutor = {
            nombre: tutor_nombre,
            apellido: tutor_apellido,
            dni: tutor_dni,
            cuil: tutor_cuil,
            telefono: tutor_telefono,
            email: tutor_email,
            direccion: tutor_direccion
        };
        
        const message = await services.crearAlumnoyTutor(Alumno, Tutor);
        res.status(201).json(message);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al insertar alumno y tutor',
            detalle: error.message 
        });
    }
}

async function actualizarAlumnoyTutor(req, res) {
    try {
        const {
            legajo, nombre, apellido, dni, cuil, email, direccion,
            link_docu, hermanos, fecha_nacimiento, id_tutor,
            tutor_nombre, tutor_apellido, tutor_dni, tutor_cuil,
            tutor_telefono, tutor_email, tutor_direccion
        } = req.body;

        const Alumno = {
            id_alumno: req.params.id,
            legajo, nombre, apellido, dni, cuil, email, direccion,
            link_docu, hermanos, fecha_nacimiento
        };

        const Tutor = {
            id_tutor,
            nombre: tutor_nombre,
            apellido: tutor_apellido,
            dni: tutor_dni,
            cuil: tutor_cuil,
            telefono: tutor_telefono,
            email: tutor_email,
            direccion: tutor_direccion
        };
        
        const message = await services.actualizarAlumnoyTutor(Alumno, Tutor);
        res.json(message);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar alumno y tutor' });
    }
}
async function buscarAlumnoPorDniQuery(req, res) {
  const { dni } = req.query;
  
  if (!dni) {
    return res.status(400).json({ error: 'Debe proporcionar un DNI' });
  }

  try {
    const alumno = await services.buscarAlumnoPorDni(dni);
    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    listarAlumnos,
    buscarAlumno, 
    crearAlumnoyTutor, 
    actualizarAlumnoyTutor,
    buscarAlumnoPorDniQuery
}