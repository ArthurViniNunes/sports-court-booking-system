import express from 'express';
import controller from '../controllers/jogadoresController.js';
import wrapController from '../utils/wrapController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const c = wrapController(controller);

const router = express.Router();

router.get('/', requireAuth, requireAdmin, c.getAll);
router.get('/:id', requireAuth, c.getById);
router.put('/:id', requireAuth, c.update);
router.delete('/:id', requireAuth, c.delete);

export default router;