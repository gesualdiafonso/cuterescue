
import clientPromise from '../services/useConnection.js';



class Location{

    constructor(){
        this.collectionName = 'locations';
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

    async add(location){
        const collection = await this.getCollection();
        await collection.insertOne(location);
        return location;
    }

    async getByChipId(chip_id){
        const collection = await this.getCollection();
        return await collection.findOne({chip_id}) || null; 
    }

    async update(chip_id, updateFields) {
        const collection = await this.getCollection();

        const result = await collection.findOneAndUpdate(
            { chip_id },
            { $set: { ...updateFields, timestamp: new Date().toISOString() } },
            { returnDocument: 'after' }
        );

        if (result.value) {
            const client = await clientPromise;
            const db = client.db('cuterescue');
            const petCollection = db.collection('pets');

            await petCollection.updateOne(
                { chip_id },
                { $set: { ultima_localizacion: result.value } }
            );
        }

        return result.value;
    }

    async delete(chip_id){
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ chip_id });
        return result.deletedCount > 0;
    }

}

export default Location;