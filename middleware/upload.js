import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import clientPromise from "../services/useConnection";

let storage;

(async () => {
    const client = await clientPromise;
    const db = client.db("cuterescue");

    storage = new GridFsStorage({
        db,
        file: (req, flie) =>{
            const match = ["image/png", "image/jpeg", "image/jpg"];

            if(match.indexOf(file.mimetype) === -1){
                const filename = `${Date.now()}-cuterescue-${file.originalname}`;
                return filename;
            }

            return {
                bucketName: "uploads",
                filename: `${Date.now()}-cuterescue-${file.originalname}`,
            };
        }
    })
})();

const upload = multer({ 
    storage: multer.memoryStorage(),
});

export const getUploadMiddleware = async () => {
    if(!storage){
        const client = await clientPromise;

        const db = client.db("cuterescue");

        storage = new GridFsStorage({
            db,
            file: (req, file) => ({
                bucketName: "uploads",
                filename: `${Date.now()}-cuterescue-${file.originalname}`
            }),
        });
    }
    return multer({ storage })
}

export default upload;