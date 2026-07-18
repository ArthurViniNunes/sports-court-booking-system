import service from '../services/jogadoresService.js';

const controller = {
    create: async (req, res, next) => {
        const { nome, email, telefone } = req.body;
        const player = await service.create({ nome, email, telefone });
        return res.status(201).json(player);
    },

    getAll: async (req, res, next) => {
        const players = await service.getAll();
        return res.status(200).json(players);

    },

    getById: async (req, res, next) => {
        const { id } = req.params;
        const player = await service.getById(id);
        return res.status(200).json(player);
    },

    update: async (req, res, next) => {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;
        const player = await service.update(id, { nome, email, telefone });
        return res.status(200).json(player);
    },

    delete: async (req, res, next) => {
        const { id } = req.params;
        await service.delete(id);
        return res.status(204).send();
    }
};

export default controller;