// models/UploadModel.js
import clientPromise from "../services/useConnection.js";

class UploadModel {
    constructor() {
        this.collectionName = "uploads";
        
    }

    async getCollection() {
        const client = await clientPromise;
        const db = client.db("cuterescue");
        return db.collection(this.collectionName);
    }

    validate(upload) {
        if (!upload.userId) throw new Error("userId is required");
        if (!upload.name) throw new Error("name is required");
        if (!upload.src) throw new Error("src is required");
        return true;
    }

    async create(upload) {
        this.validate(upload);
        const collection = await this.getCollection();
        const result = await collection.insertOne(upload);
        return { ...upload, _id: result.insertedId };
    }

    async findAll() {
        const collection = await this.getCollection();
        return await collection.find().toArray();
    }

    async findByUserId(userId) {
        const collection = await this.getCollection();
        return await collection.find({ userId }).toArray();
    }

    async remove(id) {
        const collection = await this.getCollection();
        return await collection.deleteOne({ _id: id });
    }
}

export default new UploadModel();
