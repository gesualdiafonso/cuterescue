import crypto from 'crypto'
import Pet from '../model/Pet.js'
import PetType from '../types/PetType.js';
import GeoAPI from '../lib/utils/services/GeoAPI.js';

const geoAPI = new GeoAPI();
const petModel = new Pet();

class PetService {
    constructor() {
        this.pets = petModel;
        this.locationService = null;
        this.detailsUserService = null;
    }

    setLocationService(locationServiceInstace){
        this.locationService = locationServiceInstace;
    }

    setDetailsUserService(detailsUserService){
        this.detailsUserService = detailsUserService;
    }

    // Validar los campos obligatorios con base a PetType
    validatePetData(data){
        const pet = {};
        for(const key in PetType){
            if (key === 'last_location') continue;
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

    async getPetByDuenoId(dueno_id) {
        return await this.pets.getByDuenoId(dueno_id)
    }

    async getPetByChipId(chip_id) {
        return await this.pets.getByChipId(chip_id)
    }

    async createPet(petData){
        const uniqueId = crypto.randomBytes(8).toString('hex');

        // validación de campos
        //const requiredFieldsPet = this.validatePetData(petData);

        // Buscar dados del dueño
        let owner = null;
        if (petData.dueno_id){
            owner = await this.detailsUserService.getByUserId(petData.dueno_id);
            if (!owner){
                throw new Error(`Dueño con ID "${petData.dueno_id}" no encontrado.`);
            }
        }

        // Determino la home_location
        let home_location = null;

        if(typeof petData.home_location === 'string' && petData.home_location.trim() !== ''){
            // Usuário ha pasadoel ederezo manual --> converter via GeoAPI
            const coords = await geoAPI.getCoordinatesFromAddress(petData.home_location);
            home_location = {
                address: petData.home_location,
                lat: coords.lat,
                lng: coords.lng,
                soruce: 'geocode_osm',
                is_safe_location: true
            };
        }
        // Si el usuario no ha informado la ubicación
        else if (owner?.ubicacion){
            // Usa la ubicación del dueño
            home_location = {
                address: owner.ubicacion.address,
                lat: owner.ubicacion.lat,
                lng: owner.ubicacion.lng,
                source: 'geocode_osm',
                is_safe_location: true
            };
        } else{
            throw new Error(
                "No se pudo geocodificar el enderezo proporcionado. Por favor, verifique y corrija el enderezo."
            );
        }

        // Cria el pet inicialmente
        const newPet = {
            id: uniqueId,
            ...petData,
            home_location,
            last_location: null, // se inicializa después
            activo: true,
            created: new Date().toISOString
        };

        await this.pets.add(newPet);

        // Cria la ubicación incial basa en el home_location
        const savedLocation = await this.locationService.createLocation({
            pet_id: uniqueId,
            dueno_id: petData.dueno_id || owner?.userId,
            chip_id: null,
            lat: home_location.lat,
            lng: home_location.lng,
            address: home_location.address,
            source: home_location.source,
            is_safe_location: true,
            timestamp: new Date().toISOString()
        });

        // Actualizar la ultima localizacion del pet
        // await this.pets.update(uniqueId, { last_location: savedLocation });
        // newPet.last_location = savedLocation;
        const locationToSave = { ...savedLocation };
        delete locationToSave._id;

        await this.pets.update(uniqueId, { last_location: locationToSave });
        newPet.last_location = locationToSave;

        // Actualizar el dueño del pet
       if(owner){
            owner.pets = owner.pets || [];
            owner.pets.push(uniqueId);
            await this.detailsUserService.update(owner.userId, { pets: owner.pets });
       }

        return newPet;
    }

    async updatePet(id, updatedFields){
        // Se atualizar ultima_localizacion, atualiza também no LocationService
        if (updatedFields.last_location){
            const pet = await this.pets.getById(id);
            if (pet) {
                await this.locationService.updateLocation(pet.chip_id, updatedFields.last_location);
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
            const owner = await this.detailsUserService.getByUserId(pet.dueno_id);
            if(owner){
                owner.pets = (owner.pets || []).filter(p => p !== pet.id);
                await this.detailsUserService.update(pet.dueno_id, { pets: owner.pets });
            }
        }

        await this.locationService.deleteLocation(pet.chip_id);
        const result = await this.pets.delete(id);

        return result.deletedCount > 0;
    }
}

export default PetService;