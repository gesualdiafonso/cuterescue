import express from "express";
import LocationController from "../controllers/LocationController.js";

const router = express.Router();

router.put('/api/locations/update%from%telegram%bot', LocationController.updateLocation)

export default router;