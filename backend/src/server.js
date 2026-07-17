const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost';

app.listen(PORT, () => {
  console.log(`Servidor rodando em ${BACKEND_URL}:${PORT}`);
});