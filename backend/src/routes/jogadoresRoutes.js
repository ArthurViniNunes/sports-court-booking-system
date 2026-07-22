import express from 'express';
import controller from '../controllers/jogadoresController.js';
import wrapController from '../utils/wrapController.js';

const c = wrapController(controller);

const router = express.Router();

router.post('/', c.create);
router.get('/', c.getAll);
router.get('/:id', c.getById);
router.put('/:id', c.update);
router.delete('/:id', c.delete);

export default router;