const services = require('./cursos.service');

async function obtenerCursos(req, res) {
  
  try {
  
    const result = await services.obtenerCursos();
    res.json(result);
  
  } catch (error) {
  
    console.log(error);
    res.status(500).json({ error: error.message });
  
  }
}

async function crearCursos(req, res) {
  const { anio, division, id_plan, anio_lectivo } = req.body;

  try {

    await services.crearCurso(anio, division, id_plan, anio_lectivo);
    return res.json({ mensaje: 'Curso insertado correctamente' });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ error: error.message });

  }
}

async function alumnosPorCursos(req, res) {
  const { anioLectivo, anio, division } = req.query;

  try {

    const result = await services.alumnosPorCurso(anioLectivo, anio, division);
    res.json(result);
  
  } catch (error) {
  
    console.log('Error en /alumnosCurso:', error);
    res.status(500).json({ error: error.message });
  
  }
}

//FUNCIONES NUEVAS 

async function alumnosSinCurso(req, res) {
  const { anioLectivo } = req.query;

  if (!anioLectivo) {
    return res.status(400).json({ error: 'Debe proporcionar año lectivo' });
  }

  try {
    const result = await services.obtenerAlumnosSinCurso(anioLectivo);
    res.json(result);
  } catch (error) {
    console.error('Error en /alumnos-sin-curso:', error);
    res.status(500).json({ error: error.message });
  }
}

async function asignarIndividual(req, res) {
  const { id_alumno, anio, division, anio_lectivo } = req.body;

  if (!id_alumno || !anio || !division || !anio_lectivo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    await services.asignarAlumnoACurso(id_alumno, anio, division, anio_lectivo);
    res.json({ mensaje: 'Alumno asignado correctamente' });
  } catch (error) {
    console.error('Error en asignar-individual:', error);
    res.status(500).json({ error: error.message });
  }
}

async function asignarMasiva(req, res) {
  const { alumnos, anio, division, anio_lectivo } = req.body;

  if (!alumnos || !Array.isArray(alumnos) || alumnos.length === 0 || !anio || !division || !anio_lectivo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    await services.asignarAlumnosMasivamente(alumnos, anio, division, anio_lectivo);
    res.json({ mensaje: `${alumnos.length} alumno(s) asignado(s) correctamente` });
  } catch (error) {
    console.error('Error en asignar-masiva:', error);
    res.status(500).json({ error: error.message });
  }
}
async function obtenerInfoCurso(req, res) {
  const { anio, division, anioLectivo } = req.query;

  if (!anio || !division || !anioLectivo) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const curso = await services.obtenerInfoCurso(anio, division, anioLectivo);
    res.json(curso);
  } catch (error) {
    console.error('Error en /obtener-info:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { 
  alumnosPorCursos, 
  obtenerCursos, 
  crearCursos, 
  alumnosSinCurso, 
  asignarIndividual, 
  asignarMasiva,
  obtenerInfoCurso
};