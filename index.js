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

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));



app.listen(process.env.PORT, () => console.log(`Its working on port ${process.env.PORT}`));

