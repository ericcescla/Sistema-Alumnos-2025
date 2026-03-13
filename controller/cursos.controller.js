const services = require('../service/cursos.service.js');

cursoIndividual = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await services.cursoIndividual(id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

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

asignarCurso = async (req, res) => {
  const { idAlumno, idCurso } = req.body;
  try {
     
    return res.json(await services.asignarCurso(idAlumno, idCurso));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

module.exports = { alumnosPorCursos, obtenerCursos, crearCursos, asignarCurso, cursoIndividual };