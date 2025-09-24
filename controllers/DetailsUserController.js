import DetailsUserService from "../services/useDetailsUser.js";
import { validateDetailsUser } from "../types/UserType.js";

const detrailsService = new DetailsUserService();

class DetailsUserController{
    async getAll(req, res){
        try {
            const details = await detrailsService.getAll();
            res.status(200).json(details);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByUserId(req, res){
        const { userId } = req.params;
        try {
            const details = await detrailsService.getByUserId(userId);
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
        const { nombre, telefono, ubicacion, pets } = req.body;

        // pets no es obligatorio, si no viene => array vacío
        const detailsData = { userId, nombre, telefono, ubicacion, pets: pets || [] };

        // Validación con tipagens
        const { isValid, errors } = validateDetailsUser(detailsData);
        if (!isValid) {
            return res.status(400).json({ error: "Validación fallida", details: errors });
        }

        try {
            const newDetails = await detrailsService.create(userId, detailsData);
            res.status(201).json(newDetails);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
}

    async update(req, res){
        const { userId } = req.params;
        const updateFields = req.body;
        try {
            const updatedDetails = await detrailsService.update(userId, updateFields);
            res.status(200).json({ message: 'Detalles del usuario actualizados exitosamente', data: updatedDetails });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res){
        const { userId } = req.params;
        try {
            const success = await detrailsService.delete(userId);
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