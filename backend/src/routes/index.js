import express from 'express';

import authRoutes from './authRoutes.js';
import jogadoresRoutes from './jogadoresRoutes.js';
import quadrasRoutes from './quadrasRoutes.js';
import reservasRoutes from './reservasRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/jogadores', jogadoresRoutes);
router.use('/quadras', quadrasRoutes);
router.use('/reservas', reservasRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;