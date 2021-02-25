const {Router} = require('express');
const {getUsuarios, postUsuario, putUsuario, deleteUsuario} = require('../controllers/usuarios')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// Ruta: /api/usuarios

const router = Router();

router.get( '/', validarJWT, getUsuarios);

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
        ],
    postUsuario);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ],
    putUsuario);

router.delete('/:id', validarJWT, deleteUsuario);

module.exports = router;
