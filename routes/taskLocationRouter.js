import express from 'express';
import Location from '../model/Location.js';

const router = express.Router();

const model = new Location; 

// **************** API DE LOCATION ********************** //

// Rota para pegar todas as localizações
router.get('/api/locations', async ( req, res ) => {
    try{
        const locations = await model.getAll();
        res.json(locations);
    } catch( error ){
        res.status(500).json( {
            erro: 'Error al cargar localización'
        } );
    }
});

// Rota para adicionar uma nova localização
// Espera receber: { chip_id, coords: { lat, lng }, timestamp }

router.post('/api/locations/:chip_id', async ( req, res ) => {
    const { chip_id, coords } = req.body;

    if (!chip_id || !coords || !coords.lat || !coords.lng) {
        return res.status(400).json({
            error: `Campus obligatorios: chip_id, coords.lat, coord.lng`
        });
    }
    try {
        const newLocation = await model.addLocation(
            {chip_id, ...coords}
        );
        res.status(201).json(newLocation);
    } catch ( error ){
        res.status(500).json({
            error: `Erro al agregar las ubicación: ${error.message}`
        });
    }
});

// Rota pata pegar os locations segundo seu Id de pet, de maneira de Back-End
router.get('/api/locations/:chip_id', async (req, res) => {
    const id = req.params.id;
    try{
        const location = await model.getById(id);
        if( location ){
            res.json(location);
        } else {
            res.status(400).json({ error: 'Ubicación de pet no fue encontrado en la API' });
        }
    } catch ( error ){
        res.status(500).json({ error: 'Erro al cargar la API de Pets' });
    }
});

// Rota para pegar localizações de um Pet pelo chip_id

router.put('/api/locations/:chip_id', async ( req, res ) => {
    const { id } = req.params;
    const upadtes = req.body;

    try {
        const updated = await model.updateLocation( id, upadtes );
        if ( !updated ){
            return res.status(404).json({
                error: `Location con id ${id}, no fue encontrada`
            })
        }
        res.json(updated);
    } catch ( error ){
        res.status(500).json({
            error: `Error al actualizar ubicación: ${error.message}`
        });
    }
});

// Rota para pegar localização única pelo ID

router.delete('/api/locations/:chip_id', async (req, res) => {
    const { id } = req.params;

    try{
        const deleted = await model.deleteLocation(id);
        if (!deleted) {
            return res.status(404).json({
                error: `Localización no encontrada`
            });
        }
        res.json({
            message: 'Localización ha sido removida con suceso'
        })
    } catch ( error ){
        res.status(500).json({ error: `Erro al deletar la ubicación: ${error.message}`})
    }
});

export default router;