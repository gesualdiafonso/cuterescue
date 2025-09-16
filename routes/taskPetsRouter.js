import express from 'express';
import Pet from '../model/Pet.js';

const router = express.Router();

const model = new Pet(); 

// **************** API PETS ********************** //

// Listar todos os pets
router.get('/api/pets', async (req, res) => {
    try {
        const pets = await model.getAll();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar os pets' });
    }
});

// Criar novo pet
router.post('/api/pets', async (req, res) => {
    const { 
        nombre, 
        especie, 
        raza, 
        dueno_id, 
        fecha_nacimiento, 
        edad, 
        sexo, 
        color, 
        foto_url, 
        activo, 
        estado_salud, 
        alertas, 
        collar_bateria, 
        nivel_actividad  
    } = req.body;

    // Validação básica
    if (!nombre || !especie || !raza || !dueno_id || !fecha_nacimiento || !edad || 
        !sexo || !color || !foto_url || activo === undefined || !estado_salud || 
        !Array.isArray(alertas) || collar_bateria === undefined || !nivel_actividad) {
        return res.status(400).json({ 
            error: "Campos obrigatórios faltando", 
            data: req.body 
        });
    }

    try {
        const newPet = await model.addPet({ 
            nombre, 
            especie, 
            raza, 
            dueno_id, 
            fecha_nacimiento, 
            edad, 
            sexo, 
            color, 
            foto_url, 
            activo, 
            ultima_localizacion: null, 
            estado_salud, 
            alertas, 
            collar_bateria, 
            nivel_actividad 
        });
        

        res.status(201).json(newPet);
    } catch (err) {
        res.status(500).json({ error: `Erro ao adicionar o pet: ${err.message}` });
    }
});

// Pegar pet por ID
router.get('/api/pets/:id', async (req, res) => {
    try {
        const pet = await model.getById(req.params.id);
        if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pet' });
    }
});

// Atualizar pet
router.put('/api/pets/:id', async (req, res) => {
    try {
        const updatedPet = await model.updatedPet(req.params.id, req.body);
        if (!updatedPet) return res.status(404).json({ error: 'Pet não encontrado' });
        res.json(updatedPet);
    } catch (err) {
        res.status(500).json({ error: `Erro ao atualizar pet: ${err.message}` });
    }
});

// Deletar pet
router.delete('/api/pets/:id', async (req, res) => {
    try {
        const deleted = await model.deleteById(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Pet não encontrado' });
        res.json({ message: 'Pet removido com sucesso' });
    } catch (err) {
        res.status(500).json({ error: `Erro ao deletar pet: ${err.message}` });
    }
});

export default router;