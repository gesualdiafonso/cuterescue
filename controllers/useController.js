import User from '../models/User.js';
import DetailsUser from '../models/DetailsUser.js';

class UserController{
    constructor(){
        this.userModel = new User();
        this.detailsModel = new DetailsUser();
    }

    /**
     * Criar usuario + detalles
     * @param {*} data { email, password, activo, nombre, telefono, ubicacion, pets }
     * 
     */
    async createUser(data){
        const { email, password, activo = true, nombre, telefono, ubicacion, pets } = data;

        // Criar usuario base (autenticación)
        const newUser = await this.userModel.create({ email, password, activo });

        // Criar detalles de usuario
        const deatils = await this.detailsModel.create(newUser.id, { nombre, email, telefono, ubicacion, pets });

        return { ...newUser, details: deatils };
    }

    /**
     * Buscar usuário completo (datos + detalles)
|    * @param {*} userId
     */
    async getUserById(userId){
        const user = await this.userModel.getUserById(userId);
        if(!user) throw new Error('Usuario no encontrado');

        const details = await this.detailsModel.getByUserId(userId);

        return { ...user, details };
    }

    /**
     * Actualizar detalles del usuario
     * (Email y contraseña sigue en User, el demas va a DetailsUser)
     */
    async updateUser(userId, data){
        const { email, password, nombre, activo, telefono, ubicacion, pets } = data;

        // Actualizar credenciales si viene algo
        if(email || password || activo !== undefined){
            await this.userModel.update(userId, { email, password, activo });
        }

        // Actualizar detalles
        const updatedDetaisl = await this.detailsModel.update( userId, {
            nombre, 
            telefono, 
            ubicacion, 
            pets
        });

        return {
            ...(await this.userModel.getByUserId(userId)),
            details: updatedDetaisl
        };
    }

    /**
     * Deletar user + detalles
     */
    async deleteUser(userId){
        await this.detailsModel.delete(userId);
        await this.userModel.desactive(userId);
        return { message: "Usuario desactivado y detalles eliminados" };
    }

}

export default UserController;