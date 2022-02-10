const  jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = (req, res, next) => {

    // Leer Token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
           ok: false,
           msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
           ok: false,
           msg: 'Token no valido'
        });
    }
}

const validarAdminRole = async (req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(500).json({
               ok: false,
               msg: 'El usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE' && uid !== id) {
            return res.status(403).json({
                ok: false,
                msg: 'El usuario no esta autorizado'
            });
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador.'
        });
    }
}

module.exports = {
    validarJWT,
    validarAdminRole
}
