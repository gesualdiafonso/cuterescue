import { GridFSBucket } from "mongodb";
import clientPromise from "../services/useConnection.js";

class UploadController{
    async uploadFile(req, res){
        if(!req.file){
            return res.status(400).json({ error: "No ha sido enviada nigún arquivo" });
        }
        res.status(201).json({
            message: "Archivo ha sido enviado con suceso",
            filename: req.file.filename,
        });
    }

    async getFile(req, res){
        try{
            
            const client = await clientPromise;
            const db = client.db("cuterescue");
            const bucket = new GridFSBucket(db, { bucketName: "uploads" });

            const { filename } = req.params;
            const downloadStream = bucket.openDownloadStreamByName(filename);

            downloadStream.on( "error", () => 
                res.status(404).json({ error: "Archivo no encontrado" })
            );

            downloadStream.pipe(res);

        } catch (error){
            res.status(500).json({ error: "Erro al recuperar el archivo" })
        }
    }
}

export default new UploadController();