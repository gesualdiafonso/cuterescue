import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post('/api/auth/login', (req, res) => AuthController.login(req, res));

router.post('/api/auth/logout', (req, res) => AuthController.logout(req, res));

export default router;