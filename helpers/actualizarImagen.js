const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const fs = require('fs');


const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathViejo = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);

            if (!medico) {
                console.log('No se encontro el medico');
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                console.log('No se encontro el hospital');
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        case 'usuarios':

            const usuario = await Usuario.findById(id);

            if (!usuario) {
                console.log('No se encontro el usuario');
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        default:
            console.log('error');
    }
}

module.exports = {
    actualizarImagen
}
