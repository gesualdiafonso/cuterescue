import crypto from 'crypto'
import Pet from '../models/Pet.js'
import Locations from '../models/Locations.js'
import DetailsUser from '../models/DetailsUser.js'

const petModel = new Pet()
const locationModel = new Locations()
const detailsUserModel = new DetailsUser()

class PetService {
    constructor() {
        this.pets = petModel
        this.locations = locationModel
        this.detailsUser = detailsUserModel
    }

    async getAllPets() {
        return await this.pets.getAll()
    }

    async getPetById(id) {
        return await this.pets.getById(id)
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

        await this.petModel.add(newPet);

        //Localización inicial
        const initialLocation = {
            lat: 0,
            lng: 0,
            Timestamp: new Date().toISOString(),
        };
        const savedLocation = await this.locations.addLocation(chipId, initialLocation);

        await this.petModel.update(uniqueId, { ultima_localizacion: savedLocation });
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
            const pet = await this.petModel.getById(id);
            if (pet) {
                await this.locationService.updateLocation(pet.chip_id, updatedFields.ultima_localizacion);
            }
        }
        return await this.pets.update(id, updatedFields);
    }

    async deletePet(id){
        const pet = await this.petModel.getById(id);
        if(!pet) return false;

        // Remove el pet del dueño
        if (pet.dueno_id){
            const owner = await this.detailsUserService.getByUserId(pet.dueno_id);
            if(owner){
                owner.pets = (owner.pets || []).filter(p => p !== pet.id);
                await this.detailsUserService.update(pet.dueno_id, { pets: owner.pets });
            }
        }

        await this.locationService.deleteLocation(pet.chip_id);
        const result = await this.petModel.delete(id);

        return result.deleteCount > 0;
    }
}

export default PetService;