import Chips from '../models/Chips.js';
import DetailsUserService from './DetailsUserService.js';
import crypto from 'crypto';
import Pet from '../models/Pet.js';


class useChipService{
    constructor(){
        this.chips = new Chips();
        this.detailsUserService = new DetailsUserService();
        this.petModel = new Pet();
        this.locationService = null;
    }

    setLocationService(locationServiceInstace){
        this.locationService = locationService
    }

    async createChip(data){
        if(!data.pet_id || data.pet_id.trim() === ''){
            throw new Error('El campo "pet_id" es obligatorio.');
        }

        const pet = await this.petModel.getById(data.pet_id);
        if(!pet){
            throw new Error(`No se encontró la mascota con id "${data.pet_id}".`);
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

        await this.chips.create(chipData);

        //Actualiza pet con el nuevo chiip_id
        await this.petModel.update( data.pet_id, { chip_id: chipId } );

        // Actualizar location con el chip_id
        if(this.locationService && pet.last_location){
            await this.locationService.updateLocation(data.pet_id, { chip_id: chipId });
        }

        return chipData;
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