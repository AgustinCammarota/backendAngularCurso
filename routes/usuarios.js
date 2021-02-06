const {Router} = require('express');
const {getUsuarios, postUsuario} = require('../controllers/usuarios')

// Ruta: /api/usuarios

const router = Router();

router.get( '/', getUsuarios);

router.post( '/', postUsuario);


module.exports = router;
