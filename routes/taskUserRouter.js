import express from 'express';
import Users from '../model/Users.js';

const router = express.Router();

const model = new Users();

// **************** API DE USERS ********************** //

// Listar todos os usuários
router.get('/api/users', async (req, res) => {
    try {
        const users = await model.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar usuários' });
    }
});

// Criar novo usuário
router.post('/api/users', async (req, res) => {
    const { nombre, email, telefono, ubicacion, activo, password, pets } = req.body;

    // validação básica
    if (!nombre || !email || !telefono || !ubicacion || !password) {
        return res.status(400).json({ 
            error: "Faltam campos obrigatórios: nombre, email, telefono, ubicacion, password",
            data: req.body
        });
    }

    try {
        const newUser = await model.addUser({ 
            nombre, 
            email, 
            telefono, 
            ubicacion, 
            activo, 
            password, 
            pets 
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: `Erro ao criar usuário: ${err.message}` });
    }
});

// Buscar usuário por ID
router.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const users = await model.getAll();
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Atualizar usuário
router.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedUser = await model.updateUser(id, updates);
        if (!updatedUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: `Erro ao atualizar usuário: ${err.message}` });
    }
});

// Deletar usuário
router.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await model.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: `Erro ao deletar usuário: ${err.message}` });
    }
});

export default router;