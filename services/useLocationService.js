import Location from '../model/Location.js';

class LocationService {
    constructor(){
        this.locationModel = new Location();
        this.petService = null;
        this.detailsUserService = null;
        this.chipService = null;
    }

    setPetService(petServiceInstance){
        this.petService = petServiceInstance;
    }

    setDetailsUserService(detailsUserService){
        this.detailsUserService = detailsUserService;
    }

    setChipService(chipService){
        this.chipService = chipService;
    }

    async getAllLocations(){
        return await this.locationModel.getAll();
    }

    async getLocationsByChipId(chip_id){
        return await this.locationModel.getByChipId(chip_id);
    }

    async getLocationsByPetId(pet_id){
        return await this.locationModel.getByPetId(pet_id);
    }

    async createLocation(locationData) {
        const { pet_id, dueno_id, chip_id, lat, lng, address, source, is_safe_location } = locationData;

        // Objeto de localização
        const newLocation = {
            pet_id,
            dueno_id,
            chip_id: chip_id || null,
            lat,
            lng,
            address,
            source: source || 'geocode_osm',
            is_safe_location: is_safe_location ?? true,
            timestamp: new Date().toISOString(),
        };

        // 👉 Inserir diretamente, sem findOneAndUpdate
        const insertResult = await this.locationModel.add(newLocation);
        // const savedLocation = { _id: insertResult.insertedId, ...newLocation };
        const savedLocation = { ...newLocation };

        // 👉 Atualizar a última localização no pet
        if (this.petService && savedLocation) {
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
                    chip_id: chip_id,
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

    async updateLocationByPetId(pet_id, updates){
        const collection = await this.locationModel.getCollection();
        const result = await collection.findOneAndUpdate(
            { pet_id },
            { $set: updates },
            { returnDocument: "after" }
        );

        return result.value;
    }

    async deleteLocation(chip_id){
        const deleted = await this.locationModel.delete(chip_id);
        return deleted;
    }
}

export default LocationService;