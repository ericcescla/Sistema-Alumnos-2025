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

module.exports = { alumnosPorCursos, obtenerCursos, crearCursos };