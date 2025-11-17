import express from 'express';
import UploadController from '../controllers/UploadController.js';
import upload from '../config/multer.js';

const router = express.Router();


//router.post('/api/uploads', upload.single("file"),UploadController.create);

router.post('/api/uploads', upload.single("file"), UploadController.create);

router.get('/api/uploads', UploadController.findAll);

router.get('/api/uploads/user/:userId', UploadController.getUploadsByUserId);

router.get('/api/uploads/user/:userId/src/:src', UploadController.getUploadsBySrc);

export default router;