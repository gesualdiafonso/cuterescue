import useChipService from "../services/useChipService.js";

const chipService = new useChipService();

class ChipController {
  async create(req, res) {
    try {
      const chip = await chipService.createChip(req.body);
      res.status(201).json(chip);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const chips = await chipService.getChips();
      res.status(200).json(chips);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const chip = await chipService.getChipById(id);
      if (!chip) return res.status(404).json({ error: "Chip não encontrado" });
      res.status(200).json(chip);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByPetId(req, res){
    const {pet_id} = req.params;
    try {
      const chip = await chipService.getByPetId(pet_id);
      if(!chip) return res.status(404).json({ error: "Chip não encontrado" });
      res.status(200).json(chip);
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  
  async getDuenoId(req, res){
    const {dueno_id} = req.params;
    try {
      const chip = await chipService.getByDuenoIdS(dueno_id);
      if(!chip) return res.status(404).json({ error: "Chip não encontrado" });
      res.status(200).json(chip);
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedChip = await chipService.updateChip(id, req.body);
      res.status(200).json(updatedChip);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await chipService.deleteChip(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ChipController();