import express from 'express';
import controller from '../controllers/jogadoresController.js';

const router = express.Router();

router.post('/', (req, res) => {
    controller.create(req, res);
});

router.get('/', (req, res) => {
    controller.getAll(req, res);
});

router.get('/:id', (req, res) => {
    controller.getById(req, res);
});

router.put('/:id', (req, res) => {
    controller.update(req, res);
});

router.delete('/:id', (req, res) => {
    controller.delete(req, res);
});

export default router;