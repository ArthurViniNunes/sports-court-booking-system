import service from '../services/reservasService.js';

const controller = {
    create: async (req, res, next) => {
        const { jogadorId, quadraId, data, horarioInicio, horarioFim } = req.body;
        const reserva = await service.create({ jogadorId, quadraId, data, horarioInicio, horarioFim });
        return res.status(201).json(reserva);
    },

    getAll: async (req, res, next) => {
        const reservas = await service.getAll();
        return res.status(200).json(reservas);
    },

    getById: async (req, res, next) => {
        const { id } = req.params;
        const reserva = await service.getById(id);
        return res.status(200).json(reserva);
    },

    getByJogadorId: async (req, res, next) => {
        const { jogadorId } = req.params;

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { quadraId, modalidade, search } = req.query;
        const filters = { quadraId, modalidade, search };

        const reservas = await service.getByJogadorId(jogadorId, page, limit, filters);
        return res.status(200).json(reservas);
    },

    getByQuadra: async (req, res, next) => {
        const { quadraId } = req.params;
        const { data } = req.query;
        const loggedUser = req.user;
        const reservas = await service.getByQuadra(quadraId, data, loggedUser);
        return res.status(200).json(reservas);
    },

    update: async (req, res, next) => {
        const { id } = req.params;
        const { jogadorId, quadraId, data, horarioInicio, horarioFim } = req.body;
        const reserva = await service.update(id, { jogadorId, quadraId, data, horarioInicio, horarioFim });
        return res.status(200).json(reserva);
    },

    delete: async (req, res, next) => {
        const { id } = req.params;
        await service.delete(id);
        return res.status(204).send();
    }
};

export default controller;