import { petService } from '../services/index.js' 

class PetController{
    async getAll(req, res){
        try{
            const pets = await petService.getAllPets();
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

            const newPet = await petService.createPet({
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
            console.error("Error creating pet:", error);
            res.status(500).json({ error: 'Erro al crear el pet' });
        }
    }

    async getById(req, res){
        try{
            const pet = await petService.getPetById(req.params.id);
            if (!pet) {
                return res.status(404).json({ error: 'Pet no encontrado' });
            }
            res.json(pet);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar el pet' });
        }
    }

    async getByChipId(req, res){
        const { chip_id } = req.params;
        try{
            const pet = await petService.getPetByChipId(chip_id);
            if(!pet){
                return res.status(404).json({ error: 'Per no fue encontrada' });
            }
            res.json(pet);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar el Pet' });
        }
    }

    async update(req, res){
        const { id } = req.params;
        const updateFields = req.body;
        try{
            const updatedPet = await petService.updatePet(id, updateFields);
            res.status(200).json({ message: 'Pet actualizado con éxito', data: updatedPet });
            // if (updatedPet) {
            //     return res.status(200).json({message: 'Pet actualizado con éxito', data: updatedPet });
            // } else{
            //     return res.status(404).json({ error: 'Pet no encontrado' });
            // }
        } catch(err){
            res.status(500).json({ error: 'Erro al actualizar el pet' });
        }
    }

    async delete(req, res){
        try {
            const deleted = await petService.deletePet(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Pet no encontrado' });
            }
            res.json({ message: 'Pet eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Erro al eliminar el pet' });
        }
    }
}

export default new PetController();