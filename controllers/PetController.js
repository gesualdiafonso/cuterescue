import { petService } from '../services/index.js' 
import UploadModel from "../model/Upload.js";
import multer from 'multer';

const upload = multer({ dets: '/uploads/' });


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
        try {
        let petData = req.body;
        let foto_url = null;

        if (req.file) {
            const uploadData = {
                name: req.file.originalname,
                userId: petData.dueno_id,
                src: `/uploads/${req.file.filename}`
            };

            const savedUpload = await UploadModel.create(uploadData);
            foto_url = savedUpload.src;
        }

        // agora adiciona corretamente
        petData.foto_url = foto_url;

        // AGORA SIM → envia os dados corretos
        const newPet = await petService.createPet(petData);

        res.status(201).json(newPet);

    } catch (error) {
        res.status(500).json({ 
            error: 'Erro al cargar el pet', 
            message: error.message 
        });
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

    async getByDuenoId(req, res){
        const { dueno_id } = req.params;
        try{
            const pets = await petService.getPetByDuenoId(dueno_id);
            if(pets.length === 0){
                return res.status(404).json({ error: 'No se encontraron pets para este dueño' });
            }
            res.json(pets);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar los pets del dueño' });
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