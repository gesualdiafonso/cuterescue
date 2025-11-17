import express from 'express';
import PetController from '../controllers/PetController.js';
import multer from 'multer';
import upload from '../config/multer.js';

//const upload = multer({ dest: '../uploads' });

const router = express.Router();

router.get('/api/pets', PetController.getAll);

router.post('/api/pets', upload.single('foto'), PetController.create);

router.get('/api/pets/:id', PetController.getById);

router.get('/api/pets/dueno/:dueno_id', PetController.getByDuenoId);

router.get('/api/pets/chip/:chip_id', PetController.getByChipId);

router.put('/api/pets/:id', PetController.update);

router.delete('/api/pets/:id', PetController.delete);

export default router;