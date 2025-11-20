import clientPromise from "../services/useConnection.js";
class Alert
{
    constructor(){
        this.collectionName = 'alert';
    }

    async getColletion(){
        const client = await clientPromise;
        const db = client.db('cuterescue');
        return db.collection(this.collectionName);
    }

    async create(alertData)
    {
        const collection = await this.getColletion();
        const data = { 
            ...alertData, 
            timestap: new Date().toISOString(),
            status: alertData.status || 'active' 
        };
        const result = await collection.insertOne(data);
        return { id: result.insertdId, ...data };
    }

    async getAll(){
        const collection = await this.getColletion();
        return await collection.find().toArray();
    }

    static async getById(id){
        const client = await clientPromise;
        const db = client.db('cuterescue');
        const collection = db.collection('alert');
        return await collection.findOne({ _id: new ObjectId(id) }) || null;
    }

    static async update(id, updateFields){
        const collection = await this.getColletion();
        const result = await collection.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            $set: updateFields
        }, {
            returnDocument: 'after'
        });
        return result.modifiedCount > 0 ? result.value : null;
    }

    static async delete(id){
        const client = await clientPromise;
        const db = client.db("cuterescue");
        const result = await db
        .collection("alert")
        .deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

export default Alert;