import clientPromise from "../services/useConnection.js";

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

    async getById(id){
        const collection = await this.getColletion();
        return await collection.findOne({ id });
    }

    async getByDuenoId(dueno_id){
        const collection = await this.getColletion();
        return await collection.findOne({ dueno_id });
    }

    async getByPetId(pet_id){
        const collection = await this.getColletion();
        return await collection.findOne({ pet_id });
    }

    async update(id, updateFields){
        const collection = await this.getColletion();
        const result = await collection.updateOne(
            { id }, 
            { $set: updateFields },
            { returnDocument: "after"}
        );

        return result.value;
    }

    async delete(chip_id){
        const collection = await this.getColletion();
        return await collection.deleteOne({ chip_id });
    }
}

export default Chip;