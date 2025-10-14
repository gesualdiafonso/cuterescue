import clientPromise from "../services/useConnection";

class Chip
{
    constructor(){
        this.collectionName = 'chip';
    }

    async getColletion(){
        const client = await clientPromise;
        const db = client.db('cuterescue');
        return db.collection(this.collectionName);
    }

    async create(chipData){
        const collection = await this.getColletion();
        const result = await collection.insertOne(chipData);
        return result;
    }

    async getAll(){
        const collection = await this.getColletion();
        return await collection.find().toArray();
    }

    static async getById(id){
        const collection = await this.getColletion();
        return await collection.findOne({ id });
    }

    static async update(id, updateFields){
        const collection = await this.getCollection();
        return await collection.updateOne({ id }, { $set: updateFields });
    }

    static async delete(id){
        const collection = await this.getCollection();
        return await collection.deleteOne({ id });
    }
}

export default Chip;