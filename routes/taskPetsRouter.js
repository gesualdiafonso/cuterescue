import express from 'express';
import PetController from '../controllers/PetController.js';
import multer from 'multer';
import upload from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

//const upload = multer({ dest: '../uploads' });

const router = express.Router();

router.get('/api/pets', verifyToken, PetController.getAll);

router.post('/api/pets', verifyToken, upload.single('foto'), PetController.create);

router.get('/api/pets/:id', verifyToken, PetController.getById);

router.get('/api/pets/dueno/:dueno_id', verifyToken, PetController.getByDuenoId);

router.get('/api/pets/chip/:chip_id', verifyToken, PetController.getByChipId);

router.put('/api/pets/:id', verifyToken, PetController.update);

router.delete('/api/pets/:id', verifyToken, PetController.delete);

export default router;