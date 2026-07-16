const express = require('express');

const app = express();

app.use(express.json());


app.get('/hello', (req, res) => {
  res.json({ 
    message: "Hello World!", 
    backendUrl: process.env.BACKEND_URL 
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});