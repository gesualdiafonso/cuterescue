import crypto from 'crypto'
import Pet from '../model/Pet.js'
import DetailsUserService from './useDetailsUser.js';


const petModel = new Pet();
const detailsUserService = new DetailsUserService();

class PetService {
    constructor() {
        this.pets = petModel;
        this.locationService = null;
        this.detailsUser = detailsUserService;
    }

    setLocationService(locationServiceInstace){
        this.locationService = locationServiceInstace;
    }

    async getAllPets() {
        return await this.pets.getAll()
    }

    async getPetById(id) {
        return await this.pets.getById(id)
    }

    async getPetByChipId(chip_id) {
        return await this.pets.getByChipId(chip_id)
    }

    async createPet(petData){
        const uniqueId = crypto.randomBytes(8).toString('hex');
        const chipId = `CHIP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const newPet = {
            id: uniqueId,
            chip_id: chipId,
            ...petData,
            ultima_localizacion: null,
        }

        await this.pets.add(newPet);

        //Localización inicial
        const initialLocation = {
            lat: 0,
            lng: 0,
            Timestamp: new Date().toISOString(),
        };
        const savedLocation = await this.locationService.createLocation(chipId, initialLocation);

        await this.pets.update(uniqueId, { ultima_localizacion: savedLocation });
        newPet.ultima_localizacion = savedLocation;

        // Actualizar el dueño del pet
        if(petData.dueno_id){
            const owner = await this.detailsUser.getByUserId(petData.dueno_id);
            if (owner){
                owner.pets = owner.pets || [];
                owner.pets.push(uniqueId);
                await this.detailsUser.update(petData.dueno_id, { pets: owner.pets });
            }
        }

        return newPet;
    }

    async updatePet(id, updatedFields) {
        if (updatedFields.ultima_localizacion){
            const pet = await this.pets.getById(id);
            if (pet) {
                await this.locationService.updateLocation(pet.chip_id, updatedFields.ultima_localizacion);
            }
        }
        return await this.pets.update(id, updatedFields);
    }

    async updatePetByChipId(chip_id, updatedFields) {
        const pet = await this.getPetByChipId(chip_id);
        if (!pet) {
            console.error('Pet no encontrado para chip_id:', chip_id);
            return null;
        }

        const updatedPet = await this.pets.update(pet.id, updatedFields);
        
        if (updatedPet) {
            console.log('Pet atualizado con sucesso:', updatedPet.id);
        }
        
        return updatedPet;
    }

    async deletePet(id){
        const pet = await this.pets.getById(id);
        if(!pet) return false;

        // Remove el pet del dueño
        if (pet.dueno_id){
            const owner = await this.detailsUser.getByUserId(pet.dueno_id);
            if(owner){
                owner.pets = (owner.pets || []).filter(p => p !== pet.id);
                await this.detailsUser.update(pet.dueno_id, { pets: owner.pets });
            }
        }

        await this.locationService.deleteLocation(pet.chip_id);
        const result = await this.pets.delete(id);

        return result.deletedCount > 0;
    }
}

export default PetService;