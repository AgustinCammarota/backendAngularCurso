const {Router} = require('express');
const {getMedicos, postMedicos, putMedicos, deleteMedicos} = require('../controllers/medicos')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


// Ruta: /api/medicos

const router = Router();

router.get( '/', getMedicos);

router.post( '/',
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido').isMongoId(),
        validarCampos
    ],
    postMedicos);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido').isMongoId(),
        validarCampos
    ],
    putMedicos);

router.delete('/:id', validarJWT, deleteMedicos);

module.exports = router;
