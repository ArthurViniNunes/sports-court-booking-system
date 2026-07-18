import express from 'express';
import routes from './routes/index.js';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/index.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost';

app.listen(PORT, () => {
  console.log(`Servidor rodando em ${BACKEND_URL}:${PORT}`);
});