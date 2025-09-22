import Location from '../model/Location.js';
import PetService from './usePetService.js';

class LocationService {
    constructor(){
        this.locationModel = new Location();
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

        await this.locationModel.addLocation(newLocation);

        //Actualiza el ultima_localizacion en el pet
        await PetService.updatePetByChipId(chip_id, {
            ultima_localizacion: newLocation
        });

        return newLocation;
    }

    async updateLocation(chip_id, updates){
        const updatedLocation = await this.locationModel.updateLocation(chip_id, {
            ...updates,
            timestamp: new Date().toISOString(),
        });

        if(updatedLocation){
            await PetService.updatePetByChipId(chip_id, {
                ultima_localizacion: updatedLocation
            });
        }

        return updatedLocation;
    }

    async deleteLocation(chip_id){
        const deleted = await this.locationModel.deleteLocation(chip_id);
        return deleted;
    }
}

export default new LocationService();