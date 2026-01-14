const repo = require("./alumnos.repository");

async function obtenerAlumnos(anio, division) {
  const result = await repo.obtenerAlumnosAnioDivision(anio, division);
  return result;
}

async function buscarAlumnoPorDni(dni) {
  const result = await repo.buscarAlumnoPorDni(dni);

  if (result.length === 0) {
    error: "alumno no encontrado";
  }

  return result;
}
//falta probar si funcina todo bien 
async function crearAlumnoyTutor(Alumno, Tutor) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const id_alumno = await repo.crearAlumno(client, Alumno);
    
    const tutorExistente = await repo.encontrarTutor(Tutor.dni);
    if (tutorExistente > 0 ) {
      const id_tutor = tutorExistente[0].id_tutor;
      await repo.asociarAlumnoTutor(client, id_alumno, id_tutor);
    } else {
      const id_tutor = await repo.crearTutor(client, Tutor);
      await repo.asociarAlumnoTutor(client, id_alumno, id_tutor);
    }
    await client.query("COMMIT");
    return { message: "Alumno y tutor insertados con éxito" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function actualizarAlumnoyTutor(Alumno, Tutor) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await repo.actualizarAlumno(client, Alumno);
    await repo.actualizarTutor(client, Tutor);
    await client.query("COMMIT");
    return { message: "Alumno y tutor actualizados con éxito" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}



module.exports = {
  obtenerAlumnos,
  buscarAlumnoPorDni,
  crearAlumnoyTutor
};
