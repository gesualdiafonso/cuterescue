import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import clientPromise from "../services/useConnection";

const storage = new GridFsStorage({
    db: clientPromise,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-cuterescue-${file.originalname}`;
            return filename;
        }
        return new Promise((resolve, reject) => {
            const filename = `${Date.now()}-cuterescue-${file.originalname}`;
            const fileInfo = {
                filename: filename,
                bucketName: "uploads"
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

export default upload;