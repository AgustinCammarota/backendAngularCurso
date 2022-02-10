const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');
const {googleVerify} = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    try {
        const {email, password} = req.body;

        const usuarioDB = await Usuario.findOne({email});

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
           ok: false,
           msg: 'Error inesperado'
        });
    }
}

const googleSingIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const {name, email, picture} = await googleVerify(googleToken);

        // Verificar si ya existe un usuario con esos datos.
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
               nombre: name,
               email,
               password: '###',
               img: picture,
               google: true
            });
        } else {
            // Existe
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Google Sing In',
            token,
            menu: getMenuFrontEnd(usuario.role)
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}
