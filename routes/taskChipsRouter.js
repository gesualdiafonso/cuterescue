import express from 'express';
import ChipController from '../controllers/ChipController.js';

const router = express.Router();

router.get('/api/chips', ChipController.getAll);

router.post('/api/chips', ChipController.create);

router.delete('/api/chips/:chip_id', ChipController.delete)

export default router;