import UserService from '../services/UserService.js';
import { validateUser } from '../types/UserType.js';

class UserController {
    async getAll(req, res) {
        try {
            const userService = new UserService();
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const userService = new UserService();
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByEmail(req, res) {
        try {
            const userService = new UserService();
            const user = await userService.getUserByEmail(req.params.email);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validación de los campos
            const { isValid, errors } = validateUser(req.body);
            if(!isValid) {
                return res.status(400).json({ error: errors});
            }

            const userService = new UserService();
            const newUser = await userService.createUser({ email, password });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { email, password, ...rest } = req.body;
        const userService = new UserService();

        try {
            // Buscamos el user antes de actualizarlo
            const existingUser = await userService.getUserById(id);
            if (!existingUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Validar email, se informado
            
            const { isValid, errors } = validateUser(req.body, []);
            if(!isValid){
                return res.status(400).json({ error: errors })
            }

            // Atualizar
            const updatedUser = await userService.updateUser(id, { email, password, ...rest });

            res.status(200).json({
                message: 'Usuario actualizado con éxito',
                user: updatedUser
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async desactive(req, res){
        const { id } = req.params;
        try {
            const userService = new UserService();
            const desactiveUser = await userService.desactive(id);
            if (!desactiveUser) {
                return res.status(404).json({ error: 'Usuario no encontrado para desactivar' });
            }
            res.json({ message: 'Usuario desactivado con éxito', user: desactiveUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const userService = new UserService();
            const deleted = await userService.deleteUser(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
            }
            res.json({ message: 'Usuario eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();