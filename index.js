const express = require('express');
require('dotenv').config();
const cors = require('cors')
const { dbConnection } = require('./database/config');

const app = express();

// User: agustin
// pass: reCf5R35zw9OlgTa

// Configurar Cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de Datos
dbConnection();

// Directorio Publico
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));


app.listen(process.env.PORT, () => console.log(`Its working on port ${process.env.PORT}`));

