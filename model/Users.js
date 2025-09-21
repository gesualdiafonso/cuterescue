
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import clientPromise from '../services/useConnection.js';

class Users {
    users = []

    constructor (){
        this.collectionName = "users";
    }

    async getCollection(){
        const client = await clientPromise;
        const db = client.db("cuterescue");
        return db.collection(this.collectionName);
    }

    // Listar usuarios
    /**
     * Pega todo los usuarios y me devuelve en un array
     * @returns {Promise<Array>} Array de usuarios
     */
    async getAll(){

        const collection = await this.getCollection();
        return await collection.find({}).toArray();
    }

    // Agregar nuevo usuario
    async create({ email, password, activo = true, active }) {
        const collection = await this.getCollection();

        const existingUser = await collection.findOne({ email });
        if(existingUser) throw new Error('Email de usuario ya existe');

        const userId = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        const status = active ?? activo;

        const newUser = {
            id: userId,
            email, 
            password: hashedPassword,
            activo: status
        };

        await collection.insertOne(newUser);
        return newUser;
    }

        /**
     * Pega un usuario por id
     * @param {*} id 
     * @returns 
     */
        async getById(id){
            const collection = await this.getCollection();
            return await collection.findOne({ id: id });
        }

    async getByEmail(email){
        const collection = await this.getCollection();
        return await collection.findOne( { email } );
    }

    async validatePassword(email, password){
        const user = await this.getByEmail(email);
        if(!user) return false;

        return await bcrypt.compare(password, user.password);
    }

    async desactivate(id){
        const collection = await this.getCollection();
        await collection.updateOne( { id }, { $set: { activo: false } } );
    }

    /**
     * Actualizar usuario por id
     * @param {*} id 
     * @param {*} updatedUser 
     * @returns 
     */
    async update( id, updatedUser ){
        // const users = await this.readJSON();
        const collection = await this.getCollection();

        if(updatedUser.password){
            updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        }

        const result = await collection.findOneAndUpdate(
            { id },
            { $set: updatedUser },
            { returnDocument: 'after' }
        );

        return result.value;
    }


    /**
     *  Eliminar usuario por id
     * @param {*} id 
     * @returns 
     */
    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ id });
        return result.deletedCount > 0;

    }
}

export default Users;