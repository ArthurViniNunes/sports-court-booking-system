import service from '../services/authService.js';

const controller = {
    register: async (req, res, next) => {
        const { nome, email, telefone, senha } = req.body;
        const player = await service.register({ nome, email, telefone, senha });
        return res.status(201).json(player);
    },
    login: async (req, res, next) => {
        const { email, senha } = req.body;
        const result = await service.login(email, senha);
        return res.status(200).json(result);
    },
    
};

export default controller;