import express from 'express';
import controller from '../controllers/quadrasController.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getById));

export default router;