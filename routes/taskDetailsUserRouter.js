import express from 'express';
import DetailsUserController from '../controllers/DetailsUserController.js';


const router = express.Router();

router.get('/api/details', DetailsUserController.getAll);

// Rota para criar detalles de usuario cuando se crea su usuario
router.post('/api/user/:userId/details', DetailsUserController.create);

// Rota para obtener detalles de usuario por userId
router.get('/api/user/:userId/details', DetailsUserController.getByUserId);

// Rota para actualizar detalles de usuario por userId
router.put('/api/user/:userId/details', DetailsUserController.update);

// Rota para eliminar detalles de usuario por userId
router.delete('/api/user/:userId/details', DetailsUserController.delete);


export default router;