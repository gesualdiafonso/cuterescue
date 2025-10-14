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

    async createLocation(chip_id, coords = { lat: 0, lng: 0 }) {
        // Cria objeto de localização garantindo timestamp
        const newLocation = {
            chip_id,
            lat: coords.lat,
            lng: coords.lng,
            timestamp: new Date().toISOString(),
        };

        const collection = await this.locationModel.getCollection();

        // Atualiza se existe, insere se não
        const result = await collection.findOneAndUpdate(
            { chip_id },
            { $set: newLocation },
            { upsert: true, returnDocument: 'after' } // use returnOriginal: false se driver antigo
        );

        // Se result.value for null, busca manualmente
        let savedLocation = result.value;
        if (!savedLocation) {
            savedLocation = await collection.findOne({ chip_id });
        }

        // Atualiza ultima_localizacion no pet se petService estiver disponível
        if (this.petService && savedLocation) {
            await this.petService.updatePetByChipId(chip_id, { ultima_localizacion: savedLocation });
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