import prisma from '../database/prisma.js';
import AppError from '../utils/AppError.js';

const service = {

    createQuadra: async (quadra) => {
        if (!quadra.nome || !quadra.modalidade || !quadra.localizacao) {
            throw new AppError('Nome, modalidade e localização são obrigatórios', 400);
        }

        return prisma.quadra.create({ data: quadra });
    },

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
    },

    updateQuadra: async (id, quadra) => {
        if (!id) {
            throw new AppError('ID da quadra é obrigatório para atualizar', 400);
        }

        if (!quadra || Object.keys(quadra).length === 0) {
            throw new AppError('Dados da quadra são obrigatórios para atualizar', 400);
        }

        if (quadra.nome !== undefined && quadra.nome.trim() === '') {
            throw new AppError('Nome da quadra não pode ser vazio', 400);
        }

        if (quadra.modalidade !== undefined && quadra.modalidade.trim() === '') {
            throw new AppError('Modalidade da quadra não pode ser vazia', 400);
        }

        if (quadra.localizacao !== undefined && quadra.localizacao.trim() === '') {
            throw new AppError('Localização da quadra não pode ser vazia', 400);
        }

        return prisma.quadra.update({
            where: { id },
            data: quadra
        });
    },

    deleteQuadra: async (id) => {
        if (!id) {
            throw new AppError('ID da quadra é obrigatório para deletar', 400);
        }
        const quadra = await prisma.quadra.findUnique({
            where: { id }
        });
        if (!quadra) {
            throw new AppError('Quadra não encontrada', 404);
        }
        await prisma.quadra.delete({
            where: { id }
        });
    }
};

export default service;