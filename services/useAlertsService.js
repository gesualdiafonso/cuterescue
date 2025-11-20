import Alert from "../model/Alert.js";
import GeoAPI from "../lib/utils/services/GeoAPI.js";

const geoAPI = new GeoAPI();

class AlertsService{
    constructor(){
        this.alertModel = new Alert();
    }

    async createAlert(data) {
        try {
            const alertData = {
                id: `ALERT-${Date.now().toString(36)}`,
                chip_id: data.chip_id || null,
                pet_id: data.pet_id,
                dueno_id: data.dueno_id,
                type: data.type,
                message: data.message,
                status: data.status || 'active',
                timestamp: data.timestamp || new Date().toISOString(),
                location: data.location || null
            };

            return await this.alertModel.create(alertData);
        } catch (error) {
            console.error('Error creando alerta:', error);
            return null;
        }
    }

    async getAllAlerts(){
        return await this.alertModel.getAll();
    }

    async getAlertById(id){
        return await this.alertModel.getById(id);
    }

    async updateAlert(id, updateFields){
        return await this.alertModel.update(id, updateFields);
    }

    async deleteAlert(id){
        return await this.alertModel.delete(id);
    }

    /**
     * Detecta movimento y genera alerta automáticamente
     * 
     */
    async handleMovementEvent(chip_id, pet_id, dueno_id){

        const coords = await geoAPI.getCoordinates(chip_id);
        const address = await geoAPI.reverseGeocode(coords.lat, coords.lng);

        const message = `Se ha detectado movimiento en la mascota con chip ${chip_id}. Última ubicación: ${address ? address.display_name : 'No disponible'}`;
        const alert = await this.createAlert({
            chip_id,
            pet_id,
            dueno_id,
            type: 'movement',
            message,
            location: {
                latitude: coords.lat,
                longitude: coords.lng,
                address
            }
        });

        /**
         * Actualiza la ubicación en el servicio de location    
         */
        await geoAPI.updatePetLocation(chip_id, coords.lat, coords.lng)
        return alert
    }
}

export default  AlertsService;