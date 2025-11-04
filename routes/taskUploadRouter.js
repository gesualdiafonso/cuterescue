import express from "express";
import UploadController from "../controllers/UploadController";
import upload, { getUploadMiddleware } from "../middleware/upload";

const router = express.Router();

router.post('/api/upload', async (req, resizeBy, next) =>{
    const upload = await getUploadMiddleware();

    upload.single("file")(req, res, (err) => {
        if(err) return res.status(500).json({ error: err.message });
        next();
    });
}, UploadController.uploadFile);

router.get("/api/upload/:filename", UploadController.getFile);

export default router;