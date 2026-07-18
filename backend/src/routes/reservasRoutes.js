import express from 'express';
import controller from '../controllers/reservasController.js';

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/quadra/:quadraId', controller.getByQuadra);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;