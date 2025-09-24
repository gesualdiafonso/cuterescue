import express from 'express';
import LocationController from '../controllers/LocationController.js';

const router = express.Router();

router.get('/api/locations', LocationController.getAll);
router.post('/api/locations/:chip_id', LocationController.addLocation);
router.get('/api/locations/:chip_id', LocationController.getByChipId);
router.put('/api/locations/:chip_id', (req, res) => LocationController.updateLocation(req, res));
router.delete('/api/locations/:chip_id', LocationController.deleteLocation);

export default router;