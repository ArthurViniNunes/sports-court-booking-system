import express from 'express';
import controller from '../controllers/quadrasController.js';
import wrapController from '../utils/wrapController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const c = wrapController(controller);

const router = express.Router();

router.post('/', requireAuth, requireAdmin, c.create);
router.get('/', requireAuth, c.getAll);
router.get('/:id', requireAuth, c.getById);
router.put('/:id', requireAuth, requireAdmin, c.update);
router.delete('/:id', requireAuth, requireAdmin, c.delete);

export default router;