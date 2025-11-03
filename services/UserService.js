import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../model/Users.js';

class UserService
{
    constructor (){
        this.userModel = new User();
    }

    async getAllUsers(){
        return await this.userModel.getAll();
    }

    //Vamos validar el password
    async validateCredentials(email, password) {
        const user = await this.userModel.getByEmail(email);
        if (!user) return false;

        // Compara a senha digitada com o hash armazenado
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    }

    async createUser({ email, password, activo = true }){

        const existingUser = await this.userModel.getByEmail(email);
        if(existingUser){
            throw new Error('Email esta en uso');
        }

        const uniqueId = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        const satus = activo ? 'active' : 'inactive';

        const newUser = {
            id: uniqueId,
            email,
            password: hashedPassword,
            activo: satus,
        };

        await this.userModel.create(newUser);
        return newUser;
    }

    async getUserById(id){
        return await this.userModel.getById(id);
    }

    async getUserByEmail(email){
        email = email.trim().toLowerCase();
        return await this.userModel.getByEmail(email);
    }

    async updateUser( id, updateFields){
        if (updateFields.password){
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
        }
        return await this.userModel.update(id, updateFields);
    }

    async desative(id){
        return await this.userModel.update(id, { activo: 'inactive' });
    }

    async delete(id){
        return await this.userModel.delete(id);
    }

}

export default UserService;