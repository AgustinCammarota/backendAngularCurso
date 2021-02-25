const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
    Usuario
        .find({}, 'nombre email role google img')
        .skip( desde )
        .limit(5),

    Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        msg: 'Obteniendo Usuarios',
        usuarios,
        total
    });
}

const postUsuario = async (req, res = response) => {

    const {email, password} = req.body;

    try {
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
               ok: false,
               msg: 'El correo ya esta ingresado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Guardando Usuario',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const putUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
               ok: false,
               msg: 'No existe un usuario por ese id'
            });
        }

        // Update
        const {password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = Usuario.findOne({email});
            if (existeEmail) {
                return res.status(400).json({
                   ok: false,
                   msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar sus correos'
            });
        }

        const usuarioUpdate = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
           ok: true,
           usuario: usuarioUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'Error Inesperado'
        });
    }
}

const deleteUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

       const usuarioDB = await Usuario.findById(uid);

       if (!usuarioDB) {
           return res.status(400).json({
               ok: false,
               msg: 'No existe un usuario por ese id'
           });
       }

       await Usuario.findByIdAndDelete(uid);

       res.json({
          ok: true,
          msg: 'Usuario eliminado'
       });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'Error Inesperado'
        });
    }
}


module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}
