import express from 'express';
import LocationController from '../controllers/LocationController.js';

const router = express.Router();

router.get('/api/locations', LocationController.getAll);

router.get('/api/locations/:chip_id', LocationController.getByChipId);

router.get('/api/locations/pets/:pet_id', LocationController.getByPetId);

router.put('/api/locations/:chip_id', (req, res) => LocationController.updateLocation(req, res));


export default router;