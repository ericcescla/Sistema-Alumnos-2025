const service = require('./users.service');

async function login(req, res) {
  try {
    const { usuario, password } = req.body;
    const result = await service.login(usuario, password, req.ip);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function  registrar(req, res) {

  try{
    const {nombre, password, dni, id_rol, id_grup} = req.body;
    const result = await service.registrar(nombre, password, dni, id_rol, id_grup);

    if(!result.success)
    {
      return res.status(401).json(result)
    }
    res.json(result);
  } catch (err)
  {
    res.status(500).json({error:err.message})
  }
  
}

module.exports = { 
  login,
  registrar

 };
