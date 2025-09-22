import express from 'express';
import Users from '../model/Users.js';

const router = express.Router();

router.get('/api/user', UserController.getAll);
router.post('/api/user', UserController.create);
router.get('/api/user/:id', UserController.getById);
router.get('/api/user/email/:email', UserController.getByEmail);
router.put('/api/user/:id', UserController.update);
router.patch('/api/user/:id/desactivate', UserController.desactivate);
router.delete('/api/user/:id', UserController.delete);

export default router;