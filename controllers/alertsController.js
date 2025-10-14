import AlertsService from '../services/useAlertsService.js';

class AlertController{
    async create(req, res){
        try {
            const alert = await AlertsService.createAlert(req.body);
            res.status(201).json(alert);
        } catch (error) {
            console.error('Error creating alert:', error);
            res.status(500).json({ error: 'Error creating alert' });
        }
    }

    async getAll(req, res){
        try {
            const alerts = await AlertsService.getAllAlerts();
            res.status(200).json(alerts);
        } catch (error) {
            console.error('Error fetching alerts:', error);
            res.status(500).json({ error: 'Error fetching alerts' });
        }
    }

    async getById(req, res){
        try {
            const alert = await AlertsService.getAlertById(req.params.id);
            if (!alert) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            res.status(200).json(alert);
        } catch (error) {
            console.error('Error fetching alert:', error);
            res.status(500).json({ error: 'Error fetching alert' });
        }
    }

    async updated(req, res) {
        const { id } = req.params;
        const updateFields = req.body;
        try {
            const updatedAlert = await AlertsService.updateAlert(id, updateFields);
            if (!updatedAlert) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            res.status(200).json({ message: 'Alert updated successfully', data: updatedAlert });
        } catch (error) {
            res.status(500).json({ error: 'Error updating alert' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await AlertsService.deleteAlert(id);
            if (!result) return res.status(404).json({ error: "Alert not found" });
            res.status(200).json({ message: "Alert deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: "Error deleting alert" });
        }
    }

    // Endpoint para simular movimiento y generar alerta
    async simulateMovement(req, res){
        const { chip_id, pet_id, dueno_id } = req.body;
        if(!chip_id || !pet_id || !dueno_id){
            return res.status(400).json({ error: 'chip_id, pet_id y dueno_id son requeridos' });
        }
        try {
            const alert = await AlertsService.handleMovementEvent(chip_id, pet_id, dueno_id);
            res.status(201).json(alert);
        } catch (error) {
            console.error('Error simulating movement:', error);
            res.status(500).json({ error: 'Error simulating movement' });
        }
    }
}

export default new AlertController();