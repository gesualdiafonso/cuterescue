import express from 'express';
import PetController from '../controllers/PetController.js';

const router = express.Router();

router.get('/api/pets', PetController.getAll);

router.post('/api/pets', PetController.create);

router.get('/api/pets/:id', PetController.getById);

router.get('/api/pets/dueno/:dueno_id', PetController.getByDuenoId);

router.get('/api/pets/chip/:chip_id', PetController.getByChipId);

router.put('/api/pets/:id', PetController.update);

router.delete('/api/pets/:id', PetController.delete);

export default router;