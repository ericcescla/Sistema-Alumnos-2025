const db = require('../dbDatos.js');

exports.obtenerProfesores = async () => {
    const {rows} = await db.query('SELECT * FROM profesores');
    return rows;
};

exports.crearProfesor = async (data) => {
    const { nombre, apellido } = data;
    const  result =  await db.query('INSERT INTO profesores (nombre, apellido) VALUES ($1, $2)  RETURNING *', [nombre, apellido]);
    return result.rows[0];
};  

exports.actualizarProfesor = async (id, data) => {
    const { nombre, apellido } = data;
    const result = await db.query('UPDATE profesores SET nombre = $1, apellido = $2 WHERE id_profesor = $3 RETURNING *', [nombre, apellido, id]);
    return result.rows[0];
};

exports.eliminarProfesor = async (id) => {
    const result = await db.query('DELETE FROM profesores WHERE id_profesor = $1 RETURNING *', [id]);
    return result.rows[0];
}; 

