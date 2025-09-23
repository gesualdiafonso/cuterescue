import clientPromise from '../services/useConnection.js';

class DetailsUser
{
   
    constructor(){
        this.collectionName = 'details_user';
    }

    async getCollection(){
        const client = await clientPromise;
        const db = client.db('cuterescue');
        return db.collection(this.collectionName);
    }

    async getAll(){
        const collection = await this.getCollection();
        return await collection.find({}).toArray();
    }

    async create(userId, fields){
        const collections = await this.getCollection();
        const details = { userId, ...fields };
        await collections.insertOne(details);
        return details;
    }

    async getByUserId(userId){
        const collection = await this.getCollection();
        return await collection.findOne({ userId }) || null;
    }

    async update(userId, updateFields){
        const collections = await this.getCollection();
        const result = await collections.findOneAndUpdate(
            { userId },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        return result.value;
    }

    async delete(userId){
        const collections = await this.getCollection();
        const result = await collections.deleteOne({ userId });
        return result.deletedCount > 0;
    }

}


export default DetailsUser;