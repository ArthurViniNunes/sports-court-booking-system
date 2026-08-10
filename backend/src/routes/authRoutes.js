import express from 'express';
import controller from '../controllers/authController.js';
import wrapController from '../utils/wrapController.js';

const c = wrapController(controller);

const router = express.Router();

router.post('/register', c.register);
router.post('/login', c.login); 



export default router;