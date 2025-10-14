import express from 'express';
import LocationController from '../controllers/LocationController.js';

const router = express.Router();

router.get('/api/locations', LocationController.getAll);

router.get('/api/locations/:chip_id', LocationController.getByChipId);


router.put('/api/locations/:chip_id', (req, res) => LocationController.updateLocation(req, res));


export default router;