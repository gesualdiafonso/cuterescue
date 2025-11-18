import express from 'express';
import UserController from '../controllers/UserController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/api/user', verifyToken, UserController.getAll);

// Rota para crear un nuevo usuario
router.post('/api/user', UserController.createUser);

// Rota para obtener un usuario por ID
router.get('/api/user/:id', verifyToken, UserController.getUserById);

// Rota para obtener un usuario por email
router.get('/api/user/email/:email', verifyToken, UserController.getByEmail);

// Rota para actualizar un usuario por ID
router.put('/api/user/:id', verifyToken, UserController.updateUser);

// Rota para desactivar un usuario (soft delete)
router.patch('/api/user/:id/desactivate', verifyToken, UserController.desactive);

// Rota para eliminar un usuario (hard delete)
router.delete('/api/user/:id', verifyToken, UserController.deleteUser);

export default router;