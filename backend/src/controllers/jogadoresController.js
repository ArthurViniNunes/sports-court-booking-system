import service from '../services/jogadoresService.js';

const controller = {

    getAll: async (req, res, next) => {
        const players = await service.getAll();
        return res.status(200).json(players);

    },

    getById: async (req, res, next) => {
        const { id } = req.params;
        const player = await service.getById(id);
        return res.status(200).json(player);
    },
    
    create: async (req, res, next) => {
        const { nome, email, telefone } = req.body;
        const jogador = await service.create({ nome, email, telefone });
        return res.status(201).json(jogador);
    },

    update: async (req, res, next) => {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;
        const player = await service.update(id, { nome, email, telefone });
        return res.status(200).json(player);
    },

    updateSenha: async (req, res, next) => {
        const { id } = req.params;
        const { senhaAtual, novaSenha } = req.body;
        await service.updateSenha(id, { senhaAtual, novaSenha });
        return res.status(200).json({ message: "Senha atualizada" });
    },

    delete: async (req, res, next) => {
        const { id } = req.params;
        await service.delete(id);
        return res.status(204).send();
    }
};

export default controller;