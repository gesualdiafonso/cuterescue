import UploadModel from "../model/Upload.js";
import fs from "fs";
import { ObjectId } from "mongodb";

export const create = async (req, res) => {
    try {
        const { name, userId } = req.body;
        const file = req.file;

        if (!file) throw new Error("Arquivo não enviado");

        const uploadData = {
            name,
            userId,
            src: `/uploads/${file.filename}`
        };

        const savedUpload = await UploadModel.create(uploadData);

        return res.json({
            fileUrl: uploadData.src,
            upload: savedUpload,
            message: "Upload concluído com sucesso 🚀"
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const findAll = async (req, res) => {
    try {
        const uploads = await UploadModel.findAll();
        return res.json(uploads);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const uploadId = new ObjectId(id);

        // get upload info
        const collection = await UploadModel.getCollection();
        const uploadData = await collection.findOne({ _id: uploadId });

        if (!uploadData) {
            return res.status(404).json({ message: "Upload not found" });
        }

        // delete file
        try {
            fs.unlinkSync("." + uploadData.src);
        } catch (err) {
            console.warn("⚠️ Erro ao apagar arquivo físico:", err.message);
        }

        // delete db entry
        await UploadModel.remove(uploadId);

        return res.json({ message: "Upload deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUploadsByUserId = async (req, res) => {
    try{
        const { userId } = req.params;
        const upload = await UploadModel.findByUserId(userId);
        return res.json(upload);
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
};

export const getUploadsBySrc = async (req, res) => {
    try{
        const { userId, src } = req.params;
        const uploads = await UploadModel.findByUserId(userId);
        const upload = uploads.find(u => u.src === `/upload/${src}`);
        if(!upload){
            return res.status(404).json({ message: "Upload not found" });
        }
        return res.json(upload);

    } catch(error){
        return res.status(500).json({ error: error.message });
    }
};

export default { create, findAll, remove, getUploadsByUserId, getUploadsBySrc };
