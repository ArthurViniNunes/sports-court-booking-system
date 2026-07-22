import service from '../services/quadrasService.js';

const controller = {
    create: async (req, res, next) => {
        const { nome, modalidade, localizacao } = req.body;
        const quadra = await service.createQuadra({ nome, modalidade, localizacao });
        return res.status(201).json(quadra);
    },

    getAll: async (req, res, next) => {
        const quadras = await service.getAllQuadras();
        return res.status(200).json(quadras);
    },

    getById: async (req, res, next) => {
        const { id } = req.params;
        const quadra = await service.getQuadraById(id);
        return res.status(200).json(quadra);
    },

    update: async (req, res, next) => {
        const { id } = req.params;
        const { nome, modalidade, localizacao } = req.body;
        const quadra = await service.updateQuadra(id, { nome, modalidade, localizacao });
        return res.status(200).json(quadra);
    },

    delete: async (req, res, next) => {
        const { id } = req.params;
        await service.deleteQuadra(id);
        return res.status(204).send();
    },
};

export default controller;