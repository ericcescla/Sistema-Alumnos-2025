const db = require('../dbDatos');

eliminarMateria = async (id) => {
    const result = await db.query(
        'DELETE FROM materia WHERE id_materia = $1 RETURNING *;',
        [id]
    );
    return result.rows[0];
}

actualizarMateria = async (id, nombre, profesor, rolProfesor) => {
    const result = await db.query(
        'UPDATE materia SET nombre_materia = $2, profesor = $3, rol_profesor = $4 WHERE id_materia = $1 RETURNING *;',
        [id, nombre, profesor, rolProfesor]
    );
    return result.rows[0];
}

crearMateria = async (nombre, profesor, rolProfesor) => {
    const result = await db.query(
        'INSERT INTO materia (nombre_materia, profesor, rol_profesor) VALUES ($1, $2, $3) RETURNING *;',
        [nombre, profesor, rolProfesor]
    );
    return result.rows[0];
}

existeMateria = async (idMateria) => {
  const result = await db.query(`
     SELECT EXISTS (
       SELECT 1
       FROM materia
       WHERE id_materia = $1
       );
    `, [idMateria]);
    return result.rows[0].exists;
}



obtenerMaterias = async () => {
    const { rows } = await db.query('SELECT * FROM materia;');
    return rows;
}

module.exports = {
    obtenerMaterias,
    crearMateria,
    actualizarMateria,
    eliminarMateria,
    existeMateria
}