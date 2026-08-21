import service from '../services/dashboardService.js';

const controller = {
    getStats: async (req, res, next) => {
        const stats = await service.getStats();
        return res.status(200).json(stats);
    }
};

export default controller;