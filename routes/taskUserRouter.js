import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.get('/api/user', UserController.getAll);
router.post('/api/user', UserController.createUser);
router.get('/api/user/:id', UserController.getUserById);
router.get('/api/user/email/:email', UserController.getByEmail);
router.put('/api/user/:id', UserController.updateUser);
router.patch('/api/user/:id/desactivate', UserController.desactive);
router.delete('/api/user/:id', UserController.deleteUser);

export default router;