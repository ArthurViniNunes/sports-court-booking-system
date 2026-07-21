import prisma from '../database/prisma.js';
import AppError from '../utils/AppError.js';

const service = {
    getAllQuadras: async () => {
        return await prisma.quadra.findMany();
    },

    getQuadraById: async (id) => {
        if (!id) {
            throw new AppError('ID da quadra é obrigatório para buscar', 400);
        }

        const quadra = await prisma.quadra.findUnique({
            where: { id }
        });
        
        if (!quadra) {
            throw new AppError('Quadra não encontrada', 404);
        }
        
        return quadra;
    }
};

export default service;