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

    async getByPetId(req, res){
        const { pet_id } = req.params;
        try{
            const location = await locationService.getLocationsByPetId(pet_id);
            if(!location){
                return res.status(404).json({ error: 'Localización no fue encontrada' });
            }
            res.json(location);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar la localización' });
        }
    }

    async updateLocation(req, res){
        const { pet_id } = req.params;
        const updates = req.body; 
    
        try {
            const updated = await locationService.updateLocation(pet_id, updates);
    
            if (!updated){
                return res.status(404).json({
                    error: `Location con id ${pet_id}, no fue encontrada`
                });
            }
    
            res.json({
                message: "Localización actualizada con suceso",
                data: updated
            });
        } catch (error){
            res.status(500).json({
                error: `Error al actualizar ubicación: ${error.message}`
            });
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