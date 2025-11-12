import express from "express";
import UploadController from "../controllers/UploadController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/api/upload", upload.single("file"), (req, res) => {
  UploadController.uploadFile(req, res);
});

router.get("/api/upload/:filename", (req, res) => {
  UploadController.getFile(req, res);
});

export default router;
