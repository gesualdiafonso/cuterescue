import clientPromise from '../services/useConnection.js';


class DetailsUser
{
    constructor() {
        this.collectionName = "details_user";
    }

    async getCollection() {
        const client = await clientPromise;
        const db = client.db("cuterescue");
        return db.collection(this.collectionName);
    }

    async getAll() {
        const collection = await this.getCollection();
        return await collection.find({}).toArray();
    }

    async create(userId, { nombre, telefono, ubicacion, pets = [] }) {
        const collection = await this.getCollection();

        const details = {
            userId,  // referencia ao user
            nombre,
            telefono,
            ubicacion,
            pets
        };

        await collection.insertOne(details);
        return details;
    }

    async getByUserId(userId) {
        const collection = await this.getCollection();
        return await collection.findOne({ userId });
    }

    async update(userId, updatedFields) {
        const collection = await this.getCollection();

        const result = await collection.findOneAndUpdate(
            { userId },
            { $set: updatedFields },
            { returnDocument: 'after' }
        );

        return result.value;
    }

    async delete(userId) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ userId });
        return result.deletedCount > 0;
    }
}


export default DetailsUser;