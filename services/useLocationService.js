import Location from '../model/Location.js';

class LocationService {
    constructor(){
        this.locationModel = new Location();
        this.petService = null;
    }

    setPetService(petServiceInstance){
        this.petService = petServiceInstance;
    }

    async getAllLocations(){
        return await this.locationModel.getAll();
    }

    async getLocationsByChipId(chip_id){
        return await this.locationModel.getByChipId(chip_id);
    }

    async createLocation(chip_id, coords){
        const newLocation = {
            chip_id,
            lat: coords.lat,
            lng: coords.lng,
            timestamp: new Date().toISOString(),
        };

        // actualiza se existe, insere si no
        const result = await this.locationModel.getCollection().findOneAndUpdate(
            {chip_id},
            { $set: newLocation},
            { upsert: true, returnDocument: 'after' }
        );
        
        const savedLocation = result.value;


        // await this.locationModel.add(newLocation);

        //Actualiza el ultima_localizacion en el pet
        if(this.petService){
            await this.petService.updatePetByChipId(chip_id, {ultima_localizacion: savedLocation})
        }
        // await this.petService.updatePetByChipId(chip_id, {
        //     ultima_localizacion: newLocation
        // });

        return savedLocation;
    }

    async updateLocation(chip_id, updatedFields){
        const fieldsToUpdate =
        {
            ...updatedFields,
            timestamp: new Date().toISOString(),
        }
        const updatedLocation = await this.locationModel.update(chip_id, fieldsToUpdate);

        // Se não encontrou a location, retorne null para o controller responder 404
        if (!updatedLocation) return null;

        if (this.petService){
            await this.petService.updatePetByChipId(chip_id, {ultima_localizacion: updatedLocation})
        }
        // await this.petService.updatePetByChipId(chip_id, { ultima_localizacion: updatedLocation });

        return updatedLocation;
    }

    async deleteLocation(chip_id){
        const deleted = await this.locationModel.delete(chip_id);
        return deleted;
    }
}

export default LocationService;