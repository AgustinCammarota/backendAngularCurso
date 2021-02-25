const { response } = require('express');
const Hospital = require('../models/hospital');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario','nombre img');

    res.json({
       ok: true,
       hospitales: hospitales
    });

}

const postHospitales = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
           ok: false,
           msg: 'Hable con el operador'
        });
    }
}

const putHospitales = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
               ok: false,
               msg: 'No se encontro un hospital con ese id'
            });
        }

        const cambiosHospital = {
            ... req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

        res.json({
            ok: true,
            msg: 'Hospital actualizado',
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const deleteHospitales = async (req, res = response) => {

    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro un hospital con ese id'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitales,
    postHospitales,
    putHospitales,
    deleteHospitales
}
