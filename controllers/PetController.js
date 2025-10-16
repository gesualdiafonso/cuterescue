import { petService } from '../services/index.js' 

class PetController{
    async getAll(req, res){
        try{
            const pets = await petService.getAllPets();
            res.json(pets);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar los pets', message: err.message });
        }
    }

    async create(req, res){
        try{
            const newPet = await petService.createPet(req.body);
            res.status(201).json(newPet);
        } catch(error){
            res.status(500).json({ error: 'Erro al cargar el pet', message: error.message})
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