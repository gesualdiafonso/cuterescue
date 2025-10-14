import Chips from '../models/Chips.js';
import DetailsUserService from './DetailsUserService.js';
import crypto from 'crypto';
import Pet from '../models/Pet.js';


class useChipService{
    constructor(){
        this.chips = new Chips();
        this.detailsUserService = new DetailsUserService();
        this.petModel = new Pet();
    }

    async createChip(data){
        if(!data.pet_id || data.pet_id.trim() === ''){
            throw new Error('El campo "pet_id" es obligatorio.');
        }

        const chipId = `CHIP-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const timestamp = new Date().toISOString();

        const chipData = {
            id: chipId,
            pet_id: data.pet_id,
            dueno_id: data.dueno_id, 
            status: data.status,
            ultima_location: data.ultima_location,
            baterry: data.baterry,
            created_at: timestamp,
            updated_at: timestamp
        }

        const result = await this.chipModel.create(chipData);
        return { id: result.insertedId, ...chipData };
    }

    async getChips(){
        const chips = new Chips();
        return await chips.getAll();
    }

    async getChipById(id){
        return await this.chips.getById(id);
    }

    async updateChip(id, data){
        const result = await this.chipModel.update(id, data);
        if (result.modifiedCount === 0){
            throw new Error(`No se encontró el chip con id "${id}" o no hubo cambios.`);
        }
        return await this.chipModel.getById(id);
    }

    async deleteChip(id){
        const result = await this.chipModel.delte(id);
        if (result.deletedCount === 0){
            throw new Error(`No se encontró el chip con id "${id}".`);
        }
        return { message: `Chip con id "${id}" eliminado exitosamente.` };
    }
}

export default useChipService;