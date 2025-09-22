import DetailsUser from "../model/DetailsUser";
import UserService from "./useUserService.js";

class DetailsUserService
{
    constructor(){
        this.detailsUserModel = new DetailsUser();
        this.userService = new UserService();
    }

    async getAll(){
        return await this.detailsUserModel.getAll();
    }

    async getByUserId(userId){
        return await this.detailsUserModel.getByUserId(userId);
    }

    async create(userId, fields){
        const user = await this.userService.getUserById(userId);
        if(!user){
            throw new Error('Usuario no existe');
        }

        const existingDetails = await this.detailsUserModel.getByUserId(userId);
        if(existingDetails){
            throw new Error('Los detalles del usuario ya existen');
        }

        const details = await this.detailsUserModel.create(userId, fields);
        return details;
    }

    async update(userId, updateFields){
        const user = await this.userService.getUserById(userId);
        if(!user){
            throw new Error('Usuario no existe');
        }

        const existingDetails = await this.detailsUserModel.getByUserId(userId);
        if(!existingDetails){
            throw new Error('Los detalles del usuario no existen');
        }

        const updatedDetails = await this.detailsUserModel.update(userId, updateFields);
        return updatedDetails;
    }

    async delete(userId){
        const user = await this.userService.getUserById(userId);
        if(!user){
            throw new Error('Usuario no existe');
        }

        const existingDetails = await this.detailsUserModel.getByUserId(userId);
        if(!existingDetails){
            throw new Error('Los detalles del usuario no existen');
        }

        return await this.detailsUserModel.delete(userId);
    }

}

export default new DetailsUserService;