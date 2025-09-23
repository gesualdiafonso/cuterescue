
import clientPromise from '../services/useConnection.js';

class Users {
    constructor(){
        this.collectionName = 'users';
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

    async create(user){
        const collection = await this.getCollection();
        await collection.insertOne(user);
        return user;
    }

    async getById(id){
        const collection = await this.getCollection();
        return await collection.findOne({ id });
    }

    async getByEmail(email){
        const collection = await this.getCollection();
        return await collection.findOne({ email });
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

    async delete(id){
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ id });
        return result.deletedCount > 0;
    }
}

export default Users;