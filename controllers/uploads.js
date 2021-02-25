const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizarImagen');
const path = require('path');
const fs = require('fs');


const fileUpload = async (req, res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
           ok: false,
           msg: 'No es un medico, usuario u hospital'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });
    }

    const nombreArhivo = `${uuidv4()}.${extensionArchivo}`;

    const path  = `./uploads/${tipo}/${nombreArhivo}`;

    file.mv(path, (error) => {

        if (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        actualizarImagen(tipo, id, nombreArhivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArhivo
        });
    });
}

const retornaImagen = (req , res) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;
    let pathImg = ''

    pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        pathImg = path.join(__dirname, '../uploads/default.png');
        res.sendFile(pathImg)
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}
