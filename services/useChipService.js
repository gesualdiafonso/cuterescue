import Chips from '../model/Chip.js';
import crypto from 'crypto';
import Pet from '../model/Pet.js';


class useChipService{
    constructor(){
        this.chipModel = new Chips();
        this.detailsUserService = null;
        this.petModel = new Pet();
        this.locationService = null;
    }

    setLocationService(locationService){
        this.locationService = locationService
    }

    setDetailsUserService(detailsUserService){
        this.detailsUserService = detailsUserService
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

        const lastLocation = pet.last_location;

        const chipData = {
            id: chipId,
            pet_id: data.pet_id,
            dueno_id: data.dueno_id, 
            status: data.status || "active",
            last_location: lastLocation,
            created_at: timestamp,
            updated_at: timestamp
        }

        const createdChip = await this.chipModel.create(chipData);

        //Actualiza pet con el nuevo chiip_id
        await this.petModel.update( data.pet_id, { chip_id: chipId } );

         // Atualiza última localização no chip
        if (this.locationService && updatedChip) {
            const latestLocation = await this.locationService.getLocationsByChipId(id);
            if (latestLocation && latestLocation.length > 0) {
                const last = latestLocation[latestLocation.length - 1];
                await this.chipModel.update(id, { ultima_location: last });
            }
        }

        return createdChip;
    }

    async getChips(){
        const chips = new Chips();
        return await chips.getAll();
    }

    async getChipById(id){
        return await this.chipModel.getById(id);
    }

    async getByDuenoId(dueno_id){
        return await this.chipModel.getByDuenoId(dueno_id);
    }

    async getByPetId(pet_id){
        return await this.chipModel.getByPetId(pet_id);
    }

    async updateChip(id, data){
        const result = await this.chipModel.update(id, data);
        if (result.modifiedCount === 0){
            throw new Error(`No se encontró el chip con id "${id}" o no hubo cambios.`);
        }
        return await this.chipModel.getById(id);
    }

    async deleteChip(chip_id){
        const result = await this.chipModel.delete(chip_id);
        if (result.deletedCount === 0){
            throw new Error(`No se encontró el chip con id "${chip_id}".`);
        }
        return { message: `Chip con id "${chip_id}" eliminado exitosamente.` };
    }
}

export default useChipService;