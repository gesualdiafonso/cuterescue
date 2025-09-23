import { locationService } from '../services/index.js';

class LocationController{
    async getAll(req, res){
        try{
            const locations = await locationService.getAllLocations();
            res.json(locations);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar las localizaciones' });
        }
    }

    async addLocation(req, res){
        const { chip_id, lat, lng } = req.body;
        // Validación básica
        if (!chip_id || lat === undefined || lng === undefined) {
            return res.status(400).json({ 
                error: "Campos obrigatórios faltando", 
                data: req.body 
            });
        }
        try {
            const newLocation = await locationService.createLocation({
                chip_id, 
                lat, 
                lng, 
                timestamp
            });

            res.status(201).json(newLocation);
        } catch (error) {
            res.status(500).json({ error: `Erro al agregar la localización: ${error.message}` });
        }
    }

    async getByChipId(req, res){
        const { chip_id } = req.params;
        try{
            const location = await locationService.getLocationsByChipId(chip_id);
            if(!location){
                return res.status(404).json({ error: 'Localización no fue encontrada' });
            }
            res.json(location);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar la localización' });
        }
    }

    async updateLocation(req, res){
        const { chip_id } = req.params;
        if (!chip_id) {
            return res.status(404).json({ error: 'chip_id no fue encontrado' });
        }
        const { lat, lng } = req.body;
        if(lat === undefined || lng === undefined){
            return res.status(400).json({ error: 'Campos lat y lng son obligatórios' });
        }
        const updateFields = { lat, lng };
        try {
            const updatedLocation = await locationService.updateLocation(chip_id, updateFields);
            if(!updatedLocation){
                console.error(`Location con id ${chip_id}, no fue encontrada para actualizar`, updateFields);
                return res.status(404).json({ error: `Location con id ${chip_id}, no fue encontrada` });
            }
            res.json({ message: 'Localización actualizada con éxito', location: updatedLocation });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: `Erro al actualizar la localización: ${error.message}` });
        }
    }

    async deleteLocation(req, res){
        try {
            const deleted = await locationService.deleteLocation(req.params.chip_id);
            if(!deleted){
                return res.status(404).json({ error: 'Localización no fue encontrada para eliminar' });
            }
            res.json({ message: 'Localización eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ error: `Erro al eliminar la localización: ${error.message}` });
        }
    }
}

export default new LocationController();