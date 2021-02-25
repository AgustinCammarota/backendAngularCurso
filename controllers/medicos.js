const { response } = require('express');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');


const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos: medicos
    });

}

const postMedicos = async (req, res = response) => {

    const uid =  req.uid;
    const medico = new Medico({
        usuario: uid,
        ... req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
           ok: true,
           medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
           ok: false,
           msg: 'Contactar con el operador'
        });
    }

}

const putMedicos = async (req, res = response) => {

    const uid = req.uid;
    const id = req.params.id;
    const hospital = req.body.hospital;

    try {
        const [medicoDB, hospitalDB] = await Promise.all([
            Medico.findById(id),
            Hospital.findById(hospital)
        ]);

        if (!medicoDB || !hospitalDB) {
            return res.status(400).json({
               ok: false,
               msg: 'No se encontro el registro'
            });
        }

        const medicoCambios = {
            ... req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, medicoCambios, {new: true});

        res.json({
            ok: true,
            msg: 'Medico actualizado',
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con el operador'
        });
    }
}

const deleteMedicos = async (req, res = response) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro un medico con ese id'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getMedicos,
    postMedicos,
    putMedicos,
    deleteMedicos
}
