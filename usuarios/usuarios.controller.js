const service = require("./usuarios.services");

async function login(req, res) {
  try {
    const { usuario, password } = req.body;
    const result = await service.login(usuario, password, req.ip);

    if (!result.success) {
      return res.status(401).json(result);
    }
    console.log(result, "resultado del login");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function registrar(req, res) {
  try {
    const { nombre, password, dni, id_rol, id_grup } = req.body;
    const result = await service.registrar(
      nombre,
      password,
      dni,
      id_rol,
      id_grup
    );

    if (!result.success) {
      return res.status(401).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function grupos(req, res) {
  try {
    const result = await service.grupos();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function roles(req, res) {
  try {
    const result  = await service.roles();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function cargarUsuariosPorRol(req, res) {
  try {
    const result = await service.cargarUsuariosPorRol();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



async function listarUsuarios(req, res) {
  try {
    const result = await service.listarUsuarios(req.query);
    res.json(result);
  } catch (err) {
    console.error('Error en listarUsuarios:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Error interno del servidor'
    });
  }
}

module.exports = {
  login,
  registrar,
  grupos, 
  roles,
  cargarUsuariosPorRol,
  listarUsuarios

};
