import UserService from '../services/UserService.js';

class UserController {
    async getAllUsers(req, res) {
        try {
            const userService = new UserService();
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        const { userId } = req.params;
        try {
            const userService = new UserService();
            const user = await userService.getUserById(userId);
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
            if ( !email || !password) {
                return res.status(400).json({ error: 'Campos obrigatórios faltando', data: req.body });
            } else if (password.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ error: 'Email no es válido' });
            }
            const userService = new UserService();
            const newUser = await userService.createUser({ username, email, password });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { email, password, ...rest } = req.body;

        try {
            // Buscamos el user antes de actualizarlo
            const existingUser = await UserService.getUserById(id);
            if (!existingUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // validaciones
            if (email && !/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ error: 'Email no es válido' });
            }
            if (password && password.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            if (email === '' || password === '') {
                return res.status(400).json({ error: 'Email y contraseña no pueden estar vacíos' });
            }
            // actualizar usuario
            const updateUser = await UserService.updateUser(id, { email, password, ...rest });

            res.status(200).json({
                message: 'Usuario actualizado con éxito',
                user: updateUser
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