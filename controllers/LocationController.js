import LocationService from "../services/useLocationService";

class LocationController{
    async getAll(req, res){
        try{
            const locations = await LocationService.getAllLocations();
            res.json(locations);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar las localizaciones' });
        }
    }

    async create(req, res){
        const { chip_id, latitude, longitude, timestamp } = req.body;
        // Validación básica
        if (!chip_id || latitude === undefined || longitude === undefined || !timestamp) {
            return res.status(400).json({ 
                error: "Campos obrigatórios faltando", 
                data: req.body 
            });
        }
        try {
            const newLocation = await LocationService.createLocation({
                chip_id, 
                latitude, 
                longitude, 
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
            const location = await LocationService.getLocationsByChipId(chip_id);
            if(!location){
                return res.status(404).json({ error: 'Localización no fue encontrada' });
            }
            res.json(location);
        } catch(err){
            res.status(500).json({ error: 'Erro al cargar la localización' });
        }
    }

    async update(req, res){
        try {
            const updatedLocation = await LocationService.updateLocation(req.params.chip_id, req.body);
            if(!updatedLocation){
                return res.status(404).json({ error: 'Localización no fue encontrada para actualizar' });
            }
            res.json(updatedLocation);
        } catch (error) {
            res.status(500).json({ error: `Erro al actualizar la localización: ${error.message}` });
        }
    }

    async delete(req, res){
        try {
            const deleted = await LocationService.deleteLocation(req.params.chip_id);
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