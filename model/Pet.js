import clientPromise from '../services/useConnection.js'

class Pet {

    constructor(){
        this.collectionName = 'pets';
    }

    async getCollection() {
        const client = await clientPromise;
        const db = client.db('cuterescue');
        return db.collection(this.collectionName);
    }

    async getAll(){
        const collection = await this.getCollection();
        return await collection.find({}).toArray();
    }

    async add(pet){
        const collection = await this.getCollection();
        const result = await collection.insertOne(pet);
        return { _id: result.insertedId, ...pet };
    }

    async getById(id){
        const collection = await this.getCollection();
        return await collection.findOne({ id });
    }

    async getByDuenoId(dueno_id){
        const collection = await this.getCollection();
        return await collection.find({ dueno_id }).toArray();
    }

    async getByChipId(chip_id){
        const collection = await this.getCollection();
        return await collection.findOne({ chip_id }) || null;
    }

    async update(id, updateFields){
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate(
            { id },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        return result.value;
    }

    async updateLocation(chip_id, updatedFields){
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate(
            { chip_id },
            { $set: updatedFields },
            { returnDocument: 'after' }
        );
        return result.value;
    }

    async delete(id){
        const collection = await this.getCollection();
        return await collection.deleteOne({ id });
    }
}

export default Pet;