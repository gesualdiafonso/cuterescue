import fetch from 'node-fetch';

/**
 * @class GeoAPI
 * @description Classe responsable por la comunicación com APIs de geolocalización (OSM e Location Service)
 */
export default class GeoAPI
{
    constructor(){
        this.baseOSM = 'https://nominatim.openstreetmap.org/';
        this.internalLocationServiceURL = 'http://location-service:3000/api/locations';
    }

    /**
     * Consulta las coordenadas del chip
     * 
     * @param {string} chip_id 
     * @returns {Promise<{lat:number, lng:number}>}
     */
    async getCoordinates(chip_id)
    {
        const baseLat = 40.416775;
        const baseLng = -3.703790;

        const lat = baseLat + (Math.random() - 0.5) * 0.1;
        const lng = baseLng + (Math.random() - 0.5) * 0.1;

        return { chip_id, lat, lng };
    }

    /**
     * Obtiene el enderezo textual a partir de las coordenadas via OSM
     * @param {number} lat 
     * @param {number} lng 
     * @returns {Promise<string>}
     */
    async reverseGeocode(lat, lng)
    {
        const url = `${this.baseOSM}/reverse?format=json&lat=${lat}&long=${lng}&zoom=18&addressdetails=1`;

        try{
            const response = await fetch(url, {
                headers: {"User-Agent": "CuteRescue/1.0"},
            });

            if (!response.ok) throw new Error(`Error en la consulta a OSM: ${response.statusText}`);

            const data = await response.json();

            return {
                display_name: data.display_name, 
                address: data.address
            };
        } catch(error){
            console.error('Error en reverseGeocode:', error);
            return null;
        }
    }

    /**
     * Genera coordenadas aleatorias alrededor de un punto
     * @param {string} chip_id 
     * @returns {Promise<{lat:number, lng:number}>}
     */
    async simulateMovement(chip_id)
    {
        const { lat, lng } = await this.getCoordinates(chip_id);

        const moveLat = lat + (Math.random() - 0.5) * 0.002;
        const moveLng = lng + (Math.random() - 0.5) * 0.002;

        return { chip_id, lat: moveLat, lng: moveLng };
    }

    /**
     * Envia actualización al servicio de locations
     * 
     * @param {string} chip_id 
     * @param {number} lat 
     * @param {number} lng 
     * @returns {Promise<void>}
     */
    async updatePetLocation(chip_id, lat, lng)
    {
        try{
            const body = JSON.stringify({
                chip_id,
                lat, 
                lng,
                source: "geoAPI",
                movement_detected: true,
                timestamp: new Date().toISOString()
            });

            const response = await fetch(this.internalLocationServiceURL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body
            });

            if(!response.ok) throw new Error(`Error al actualizar la ubicación: ${response.statusText}`);

            const data = await response.json();

            return data;
        } catch(error){
            console.error('Error en updatePetLocation:', error);
            return null;
        }
    }
}