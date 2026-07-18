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

    getByQuadra: async (req, res, next) => {
        const { quadraId } = req.params;
        const { data } = req.query; // Exemplo: /reservas/quadra/123?data=2023-10-25
        const reservas = await service.getByQuadra(quadraId, data);
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