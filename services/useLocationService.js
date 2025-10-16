import Location from '../model/Location.js';

class LocationService {
    constructor(){
        this.locationModel = new Location();
        this.petService = null;
    }

    setPetService(petServiceInstance){
        this.petService = petServiceInstance;
    }

    setDetailsUserService(detailsUserServiceInstance){
        this.detailsUserService = detailsUserServiceInstance;
    }

    setChipService(chipServiceInstance){
        this.chipService = chipServiceInstance;
    }

    async getAllLocations(){
        return await this.locationModel.getAll();
    }

    async getLocationsByChipId(chip_id){
        return await this.locationModel.getByChipId(chip_id);
    }

    async createLocation(locationData) {
        const { pet_id, dueno_id, chip_id, lat, lng, address, source, is_safe_location } = locationData;
        
    
        // Cria objeto de localização garantindo timestamp
        const newLocation = {
            pet_id: pet_id, 
            dueno_id: dueno_id,
            chip_id: chip_id,
            lat,
            lng,
            address,
            source: source || 'geocode_osm',
            is_safe_location,
            timestamp: new Date().toISOString(),
        };

        const collection = await this.locationModel.getCollection();

        // Elija la llave del filtro: chip_id si existir, si no pet_id
        const filter = chip_id ? { chip_id } : { pet_id };

        // Atualiza se existe, insere se não
        const result = await collection.findOneAndUpdate(
            filter,
            { $set: newLocation },
            { upsert: true, returnDocument: 'after' } // use returnOriginal: false se driver antigo
        );

        // Se result.value for null, busca manualmente
        let savedLocation = result.value;
        if (!savedLocation) {
            savedLocation = await collection.findOne({ chip_id });
        }

        // Atualiza ultima_localizacion no pet
        if (this.petService && savedLocation) {
            // Se não há chip_id, atualiza via ID do pet
            if (chip_id) {
                await this.petService.updatePetByChipId(chip_id, { last_location: savedLocation });
            } else {
                await this.petService.updatePet(pet_id, { last_location: savedLocation });
            }
        }

        return savedLocation;
    }

    async updateLocation(chip_id, updates){
        const updatedLocation = await this.locationModel.update(chip_id, updates);
        if (!updatedLocation) return null;

        // 🔔 Disparar alerta de movimento
        if (updates.movement_detected === true) {
            try {
                // Buscar dados do pet
                let petData = null;
                if (this.petService) {
                    petData = await this.petService.getPetByChipId(chip_id);
                }

                await alertService.createAlert({
                    chip_id,
                    pet_id: petData?.id || null,
                    dueno_id: petData?.dueno_id || null,
                    type: "movement",
                    message: `El pet ${petData?.nombre || "desconocido"} ha cambiado de ubicación.`,
                    status: "active",
                    timestamp: new Date().toISOString(),
                    location: {
                        lat: updatedLocation.lat,
                        lng: updatedLocation.lng,
                        address: updatedLocation.address || "Ubicación actualizada",
                    }
                });
            } catch (err) {
                console.error("Error creando alerta automática:", err);
            }
            return updatedLocation;
        }
    }

    async deleteLocation(chip_id){
        const deleted = await this.locationModel.delete(chip_id);
        return deleted;
    }
}

export default LocationService;