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

        await this.locationModel.add(newLocation);

        //Actualiza el ultima_localizacion en el pet
        await this.petService.updatePetByChipId(chip_id, {
            ultima_localizacion: newLocation
        });

        return newLocation;
    }

    async updateLocation(chip_id, updates){
        const updatedLocation = await this.locationModel.update(chip_id, {
            ...updates,
            timestamp: new Date().toISOString(),
        });

        if(updatedLocation){
            await this.petService.updatePetByChipId(chip_id, {
                ultima_localizacion: updatedLocation
            });
        }

        return updatedLocation;
    }

    async deleteLocation(chip_id){
        const deleted = await this.locationModel.delete(chip_id);
        return deleted;
    }
}

export default LocationService;