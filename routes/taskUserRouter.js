import express from 'express';
import Users from '../model/Users.js';

const router = express.Router();
const userModel = new Users();

// Listar todos los usuários

router.get('/api/user', async (req, res) => {
    try {

        const user = await userModel.getAll();
        res.json(user);

    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
});

// Criar usuario
router.post('/api/user', async (req, res) => {
    try{
        const { email, password, activo = true } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        } else if(password.length < 6){
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        } else if(!/\S+@\S+\.\S+/.test(email)){
            return res.status(400).json({ error: 'Email no es valido' });
        } else if(!email || !password){
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }
        const newUser = await userModel.create({ email, password, activo });

        res.status(201).json(newUser);
    } catch(error){
        res.status(500).json({ error: error.message });
    }
});

// Pegar usuario por ID
router.get('/api/user/:id', async (req, res) => {
    try {
        const user = await userModel.getById(req.params.id);
        if(!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar usuario por email
router.get('/api/user/email/:email', async (req, res) => {
    try {
        const user = await userModel.getByEmail(req.params.email);
        if(!update) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Actualizar usuario
router.put('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password, ...rest } = req.body;

    try {
        // 1. Buscar user antes de atualizar
        const existingUser = await userModel.getById(id);

        if (!existingUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Validaciones
        if (password && password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Email no es valido' });
        }
        if (email === '' || password === '') {
            return res.status(400).json({ error: 'Email y contraseña no pueden estar vacios' });
        }

        // 3. Atualizar usuário
        const updatedUser = await userModel.update(id, { email, password, ...rest });

        // 4. Retornar mensagem clara
        res.status(200).json({
            message: 'Usuario actualizado con éxito',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Desactivar usuario
router.patch('/api/user/:id/dasactivate', async (req, res) => {
    try {
        await userModel.desactivate(req.params.id);
        res.json({ message: 'Usuario desactivado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;