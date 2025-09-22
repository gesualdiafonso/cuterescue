import express from 'express';
import LocationsController from '../controllers/LocationsController.js';

const router = express.Router();

router.get('/api/locations', LocationsController.getAll);
router.post('/api/locations/:chip_id', LocationsController.addLocation);
router.get('/api/locations/:chip_id', LocationsController.getByChipId);
router.put('/api/locations/:chip_id', LocationsController.updateLocation);
router.delete('/api/locations/:chip_id', LocationsController.deleteLocation);

export default router;