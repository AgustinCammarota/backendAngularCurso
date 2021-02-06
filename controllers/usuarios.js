const {response} = require('express');
const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {

    const usuario = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        msg: 'Obteniendo Usuarios',
        usuarios: usuario
    });
}

const postUsuario = async (req, res = response) => {

    const {email, password, nombre} = req.body;

    try {
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
               ok: false,
               msg: 'El correo ya esta ingresado'
            });
        }

        const usuario = new Usuario(req.body);

        await usuario.save();

        res.json({
            ok: true,
            msg: 'Guardando Usuario',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}


module.exports = {
    getUsuarios,
    postUsuario
}
