const express = require('express');

const router = express.Router();

const jogadoresRoutes = require('./jogadores');
const quadrasRoutes = require('./quadras');
const reservasRoutes = require('./reservas');


router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


router.use('/jogadores', jogadoresRoutes);
router.use('/quadras', quadrasRoutes);
router.use('/reservas', reservasRoutes);

module.exports = router;