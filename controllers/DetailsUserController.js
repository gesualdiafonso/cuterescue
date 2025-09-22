import DetailsUserService from "../services/useDetailsUser";

class DetailsUserController{
    async getAll(req, res){
        try {
            const details = await DetailsUserService.getAll();
            res.status(200).json(details);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByUserId(req, res){
        const { userId } = req.params;
        try {
            const details = await DetailsUserService.getByUserId(userId);
            if(!details){
                return res.status(404).json({ error: 'Detalles del usuario no encontrados' });
            }
            res.status(200).json(details);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res){
        const { userId } = req.params;
        const fields = req.body;
        try {
            const { userId, nombre, telefono, ubicacion, pets = []} = fields;
            if (!userId || !nombre || !telefono || !ubicacion) {
                return res.status(400).json({ 
                    error: "Campos obrigatórios faltando", 
                    data: req.body 
                });
            }

            // validar si existe el user
            const user = await DetailsUserService.getByUserId(userId);
            if(user){
                return res.status(400).json({ error: 'Los detalles del usuario ya existen' });
            }
            
            const newDetails = await DetailsUserService.create(userId, { nombre, telefono, ubicacion, pets });
            res.status(201).json(newDetails);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res){
        const { userId } = req.params;
        const updateFields = req.body;
        try {
            const updatedDetails = await DetailsUserService.update(userId, updateFields);
            res.status(200).json(updatedDetails);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res){
        const { userId } = req.params;
        try {
            const success = await DetailsUserService.delete(userId);
            if(!success){
                return res.status(404).json({ error: 'Detalles del usuario no encontrados para eliminar' });
            }
            res.status(200).json({ message: 'Detalles del usuario eliminados exitosamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

export default new DetailsUserController();