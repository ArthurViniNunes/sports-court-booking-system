import express from 'express';
import controller from '../controllers/quadrasController.js';
import wrapController from '../utils/wrapController.js';

const c = wrapController(controller);

const router = express.Router();

router.get('/', c.getAll);
router.get('/:id', c.getById);

export default router;