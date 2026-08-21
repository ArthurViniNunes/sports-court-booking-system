import express from 'express';
import controller from '../controllers/dashboardController.js';
import wrapController from '../utils/wrapController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const c = wrapController(controller);
const router = express.Router();

// Apenas administradores logados podem acessar esses dados
router.get('/stats', requireAuth, requireAdmin, c.getStats);

export default router;