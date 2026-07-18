import express from 'express';

import jogadoresRoutes from './jogadoresRoutes.js';
import quadrasRoutes from './quadrasRoutes.js';
import reservasRoutes from './reservasRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


router.use('/jogadores', jogadoresRoutes);
router.use('/quadras', quadrasRoutes);
router.use('/reservas', reservasRoutes);

export default router;