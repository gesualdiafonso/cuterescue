import express from 'express';
import UploadController from '../controllers/UploadController.js';
import upload from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


//router.post('/api/uploads', upload.single("file"),UploadController.create);

router.post('/api/uploads', verifyToken, upload.single("file"), UploadController.create);

router.get('/api/uploads', verifyToken, UploadController.findAll);

export default router;