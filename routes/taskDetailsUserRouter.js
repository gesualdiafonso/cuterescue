import express from 'express';
import DetailsUser from '../model/DetailsUser.js';
import Users from '../model/Users.js';

const router = express.Router();
const detailsModel = new DetailsUser();
const userModel = new Users();

// Criar detalles del usuario
router.post('/api/user/details', async (req, res) => {
    try {
        const { userId, nombre, telefono, ubicacion, pets = [] } = req.body;

        if (!userId || !nombre || !telefono || !ubicacion) {
            return res.status(400).json({ error: 'Campos obligatorios faltando' });
        }

        // validar se el user existe
        const user = await userModel.getById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no existe' });
        }

        const details = await detailsModel.create(userId, { nombre, telefono, ubicacion, pets });
        res.status(201).json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar todos los detalles
router.get('/api/details', async (req, res) => {
    try {
        const details = await detailsModel.getAll();
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar detalles por userId
router.get('/api/user/details/:userId', async (req, res) => {
    try {
        const details = await detailsModel.getByUserId(req.params.userId);
        if (!details) {
            return res.status(404).json({ error: 'Detalles no encontrados' });
        }
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar detalles
router.put('/api/user/details/:userId', async (req, res) => {
    const updated = await detailsModel.update(req.params.userId, req.body);
    try {
        if (!updated) {
            return res.status(404).json({ error: 'Detalles no encontrados' });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar detalles
router.delete('/api/user/details/:userId', async (req, res) => {
    try {
        const deleted = await detailsModel.delete(req.params.userId);
        if (!deleted) {
            return res.status(404).json({ error: 'Detalles no encontrados' });
        }
        res.json({ message: 'Detalles eliminados con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;