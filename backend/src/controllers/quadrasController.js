import service from '../services/quadrasService.js';

const controller = {
    getAll: async (req, res, next) => {
        const quadras = await service.getAllQuadras();
        return res.status(200).json(quadras);
    },

    getById: async (req, res, next) => {
        const { id } = req.params;
        const quadra = await service.getQuadraById(id);
        return res.status(200).json(quadra);
    }
};

export default controller;