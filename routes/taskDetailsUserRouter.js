import express from 'express';
import DetailsUserController from '../controllers/DetailsUserController.js';


const router = express.Router();

router.get('/api/details', DetailsUserController.getAll);
router.post('/api/user/:userId/details', DetailsUserController.create);
router.get('/api/user/:userId/details', DetailsUserController.getByUserId);
router.put('/api/user/:userId/details', DetailsUserController.update);
router.delete('/api/user/:userId/details', DetailsUserController.delete);


export default router;