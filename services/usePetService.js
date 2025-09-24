import crypto from 'crypto'
import Pet from '../model/Pet.js'
import DetailsUserService from './useDetailsUser.js';
import PetType from '../types/PetType.js';

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

    // Validar los campos obligatorios con base a PetType
    validatePetData(data){
        const pet = {};
        for(const key in PetType){
            if (key === 'ultima_localizacion') continue;
            if(!(key in data)){
                throw new Error(`Campos obligatorios "${key}", no fueron fornecidos`);
            }
            pet[key] = data[key];
        }
        return pet;
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
        const chipId = petData.chip_id || `CHIP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // validación de campos
        const requiredFieldsPet = this.validatePetData(petData);

        // inicializa la ultima_localización
        let initialCoords;
        if(!petData.ultima_localizacion || Object.keys(petData.ultima_localizacion).length === 0){
            // No fornecido o vazio --> default
            initialCoords = { lat: 0, lng: 0, timestamp: new Date() };
        } else {
            // Datos fornecidos -> usa valores o default 0
            initialCoords = {
                lat: petData.ultima_localizacion.lat || 0,
                lng: petData.ultima_localizacion.lng || 0,
                timestamp: new Date()
            };
        }

        // Cria el pet inicialmente
        const newPet = {
            id: uniqueId,
            chip_id: chipId,
            ...petData,
            ultima_localizacion: null,
        }

        await this.pets.add(newPet);

        // Cria localización inicial inicial, mesmo que usuario não forneça
        // const initialCoords = (petData.ultima_localizacion && 
        //     typeof petData.ultima_localizacion.lat !== 'undefined' &&
        //     typeof petData.ultima_localizacion.lng !== 'undefined') 
        //     petData.ultima_localizacion 
        //     : { lat: 0, lng: 0 };

        const savedLocation = await this.locationService.createLocation(chipId, initialCoords);

        // Atualiza ultima_localizacion en pet
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

    async updatePet(id, updatedFields){
        // Se atualizar ultima_localizacion, atualiza também no LocationService
        if (updatedFields.ultima_localizacion){
            const pet = await this.pets.getById(id);
            if (pet) {
                await this.locationService.updateLocation(pet.chip_id, updatedFields.ultima_localizacion);
            }
        }
        return await this.pets.update(id, updatedFields);
    }

    async updatePetByChipId(chip_id, updatedFields) {
        const pet = await this.pets.getByChipId(chip_id);
        if (!pet) return null;

        const updatedPet = await this.pets.update(pet.id, updatedFields);
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