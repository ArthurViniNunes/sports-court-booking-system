import express from 'express';
import controller from '../controllers/reservasController.js';
import asyncHandler from '../middlewares/asyncHandler.js'

const router = express.Router();

router.post('/', asyncHandler(controller.create));
router.get('/', asyncHandler(controller.getAll));
router.get('/:quadraId', asyncHandler(controller.getByQuadra));
router.get('/:id', asyncHandler(controller.getById));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.delete));

export default router;