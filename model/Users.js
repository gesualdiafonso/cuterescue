
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import clientPromise from '../services/useConnection.js';

class Users {
    users = []
    //path = './data/users.json'

    // constructor( users=[] ){
    //     this.user = users
    // }
    constructor (){
        this.collectionName = "users";
    }

    async getCollection(){
        const client = await clientPromise;
        const db = client.db("cuterescue");
        return db.collection(this.collectionName);
    }

    // async saveJSON(){
    //     const data = JSON.stringify(this.user, null, 2);
    //     try{
    //         await fs.writeFile(this.path, data);
    //         console.log('Dados del pet agregado con suceso');
    //     } catch(error){
    //         console.log('Error al guardar el pet', error);
    //     }
    // }

    // async readJSON(){
    //     try{
    //         const data = await fs.readFile(this.path);
    //         return JSON.parse(data);
    //     }catch(error){
    //         console.log('Error al leer el archivo', error);
    //     }
    // }

    // Listar usuarios
    
    /**
     * Pega todo los usuarios y me devuelve en un array
     * @returns {Promise<Array>} Array de usuarios
     */
    async getAll(){
        // const user = await this.readJSON();
        // return user || this.users;
        const collection = await this.getCollection();
        return await collection.find({}).toArray();
    }

    /**
     * Pega un usuario por id
     * @param {*} id 
     * @returns 
     */
    async getById(id){
        // const users = await this.readJSON();
        // return users.find( u => u.id === id);
        const collection = await this.getCollection();
        return await collection.findOne({ id: id });
    }

    // Agregar nuevo usuario
    async addUser(user) {
        // this.user = await this.readJSON() || [];
        const collection = await this.getCollection();
    
        const uniqueId = crypto.randomBytes(8).toString('hex');

        // Hash da senha
        const hashedPassword = await bcrypt.hash(user.password, 10);
    

        const newUser = {
            id: uniqueId,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            ubicacion: user.ubicacion,
            activo: user.activo ?? true,
            password: hashedPassword, // salva o hash
            pets: user.pets || []
        };
    
        // this.user.push(newUser);
        // await this.saveJSON();
        await collection.insertOne(newUser);
        return newUser;
    }

    /**
     * Actualizar usuario por id
     * @param {*} id 
     * @param {*} updatedUser 
     * @returns 
     */
    async updateUser( id, updatedUser ){
        // const users = await this.readJSON();
        const collection = await this.getCollection();

        if(updatedUser.password){
            updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        }

        const result = await collection.findOneAndUpdate(
            { id: id},
            { $set: updatedUser },
            { returnDocument: 'after' } // para retornar el documento actualizado
        );

        return result.value;

        //const index = users.findIndex( u => u.id === id);

        // if (index !== -1 ){
            
        //     // Se tiver password nuevo, encriptar nuevamente.

        //     if (updatedUser.password) {
        //         updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        //     }

        //     users[index] = {
        //         ...users[index], 
        //         ...updatedUser
        //     };
        //     this.users = users;

        //     await this.saveJSON();

        //     return users[index];
        // }

        // return null;
    }


    /**
     *  Eliminar usuario por id
     * @param {*} id 
     * @returns 
     */
    async deleteUser(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ id });
        return result.deleteCount > 0;
        
        // const users = await this.readJSON();
        // const index = users.findIndex(u => u.id === id);

        // if (index !== -1) {
        //     users.splice(index, 1);
        //     this.users = users;
        //     await this.saveJSON();
        //     return true;
        // }
        // return false;
    }
}

export default Users;