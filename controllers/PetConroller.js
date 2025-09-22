import PetService from "../services/usePetService.js";

class PetController{
    async getAll(req, res){
        try{
            const pets = await PetService.getAllPets();
            res.json(pets);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar los pets' });
        }
    }

    async create(req, res){
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
        // Validación básica
        if (!nombre || !especie || !raza || !dueno_id || !fecha_nacimiento || !edad || 
            !sexo || !color || !foto_url || activo === undefined || !estado_salud || 
            !Array.isArray(alertas) || collar_bateria === undefined || !nivel_actividad) {
            return res.status(400).json({ 
                error: "Campos obrigatórios faltando", 
                data: req.body 
            });
        }
        try {

            const newPet = await PetService.createPet({
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
        } catch (error) {
            res.status(500).json({ error: 'Erro al crear el pet' });
        }
    }

    async getById(req, res){
        try{
            const pet = await PetService.getPetById(req.params.id);
            if (!pet) {
                return res.status(404).json({ error: 'Pet no encontrado' });
            }
            res.json(pet);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar el pet' });
        }
    }

    async update(req, res){
        try{
            const updatedPet = await PetService.updatePet(req.params.id, req.body);

            if (!updatedPet) {
                // tenta pegar o registro agora — se existir, devolve ele (segurança)
                const petNow = await model.getById(req.params.id);
                if (petNow) return res.status(200).json(petNow);
                return res.status(404).json({ error: 'Pet não encontrado' });
            }
            res.json(updatedPet);
        } catch(err){
            res.status(500).json({ error: 'Erro al actualizar el pet' });
        }
    }

    async delete(req, res){
        try {
            const deleted = await PetService.deletedPet(req.params.id);
            if (deleted.deletedCount === 0) {
                return res.status(404).json({ error: 'Pet no encontrado' });
            }
            res.json({ message: 'Pet eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Erro al eliminar el pet' });
        }
    }
}