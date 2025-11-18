import express from 'express';
import LocationController from '../controllers/LocationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/api/locations', verifyToken, LocationController.getAll);

router.get('/api/locations/:chip_id', verifyToken, LocationController.getByChipId);

router.get('/api/locations/pets/:pet_id', verifyToken, LocationController.getByPetId);

router.put('/api/locations/:chip_id', (req, res) => LocationController.updateLocation(req, res));


export default router;