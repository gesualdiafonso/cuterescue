// routes/testGeo.js
import express from 'express';
import GeoAPI from '../lib/utils/services/GeoAPI.js';

const router = express.Router();
const geo = new GeoAPI();

router.get('/simulate/:chip_id', async (req, res) => {
  const { chip_id } = req.params;
  const coords = await geo.simulateMovement(chip_id);
  res.json(coords);
});

router.get('/reverse', async (req, res) => {
  const { lat, lng } = req.query;
  const address = await geo.reverseGeocode(lat, lng);
  res.json(address);
});

export default router;
