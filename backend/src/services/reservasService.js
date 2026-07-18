import prisma from '../database/prisma.js';
import AppError from '../utils/AppError.js';

const service = {
    create: async (reservaData) => {
        const { jogadorId, quadraId, data, horarioInicio, horarioFim } = reservaData;
        
        if (!jogadorId || !quadraId || !data || !horarioInicio || !horarioFim) {
            throw new AppError('Jogador, quadra, data, horário de início e término são obrigatórios', 400);
        }

        const jogadorExiste = await prisma.jogador.findUnique({ where: { id: jogadorId } });
        if (!jogadorExiste) throw new AppError('Jogador não encontrado', 404);

        const quadraExiste = await prisma.quadra.findUnique({ where: { id: quadraId } });
        if (!quadraExiste) throw new AppError('Quadra não encontrada', 404);

        const dataReserva = new Date(data);
        const inicio = new Date(horarioInicio);
        const fim = new Date(horarioFim);

        if (inicio >= fim) {
            throw new AppError('O horário de fim deve ser posterior ao horário de início', 400);
        }

        const conflito = await prisma.reserva.findFirst({
            where: {
                quadraId,
                data: dataReserva,
                AND: [
                    { horarioInicio: { lt: fim } },
                    { horarioFim: { gt: inicio } }
                ]
            }
        });

        if (conflito) {
            throw new AppError('Já existe uma reserva para esta quadra neste horário', 400);
        }

        const reserva = await prisma.reserva.create({
            data: {
                jogadorId,
                quadraId,
                data: dataReserva,
                horarioInicio: inicio,
                horarioFim: fim
            },
            include: {
                jogador: true,
                quadra: true
            }
        });

        return reserva;
    },

    getAll: async () => {
        const reservas = await prisma.reserva.findMany({
            include: {
                jogador: true,
                quadra: true
            },
            orderBy: [
                { data: 'asc' },
                { horarioInicio: 'asc' }
            ]
        });
        return reservas;
    },

    getById: async (id) => {
        if (!id) throw new AppError('ID da reserva é obrigatório para buscar', 400);

        const reserva = await prisma.reserva.findUnique({
            where: { id },
            include: { jogador: true, quadra: true }
        });

        if (!reserva) throw new AppError('Reserva não encontrada', 404);
        
        return reserva;
    },

    getByQuadra: async (quadraId, dataStr) => {
        if (!quadraId) throw new AppError('ID da quadra é obrigatório', 400);

        const whereClause = { quadraId };
        
        if (dataStr) {
            whereClause.data = new Date(dataStr);
        }

        const reservas = await prisma.reserva.findMany({
            where: whereClause,
            include: { jogador: true, quadra: true },
            orderBy: { horarioInicio: 'asc' }
        });

        return reservas;
    },

    update: async (id, reservaData) => {
        if (!id) throw new AppError('ID da reserva é obrigatório para atualizar', 400);

        const exists = await prisma.reserva.findUnique({ where: { id } });
        if (!exists) throw new AppError("Reserva não encontrada", 404);

        const updates = {};
        if (reservaData.jogadorId) updates.jogadorId = reservaData.jogadorId;
        if (reservaData.quadraId) updates.quadraId = reservaData.quadraId;
        if (reservaData.data) updates.data = new Date(reservaData.data);
        if (reservaData.horarioInicio) updates.horarioInicio = new Date(reservaData.horarioInicio);
        if (reservaData.horarioFim) updates.horarioFim = new Date(reservaData.horarioFim);

        const quadraValidacao = updates.quadraId || exists.quadraId;
        const dataValidacao = updates.data || exists.data;
        const inicioValidacao = updates.horarioInicio || exists.horarioInicio;
        const fimValidacao = updates.horarioFim || exists.horarioFim;

        if (inicioValidacao >= fimValidacao) {
            throw new AppError('O horário de fim deve ser posterior ao horário de início', 400);
        }

        if (updates.quadraId || updates.data || updates.horarioInicio || updates.horarioFim) {
            const conflito = await prisma.reserva.findFirst({
                where: {
                    id: { not: id },
                    quadraId: quadraValidacao,
                    data: dataValidacao,
                    AND: [
                        { horarioInicio: { lt: fimValidacao } },
                        { horarioFim: { gt: inicioValidacao } }
                    ]
                }
            });

            if (conflito) {
                throw new AppError('Já existe uma reserva para esta quadra neste horário', 400);
            }
        }

        return prisma.reserva.update({
            where: { id },
            data: updates,
            include: { jogador: true, quadra: true }
        });
    },

    delete: async (id) => {
        if (!id) throw new AppError('ID da reserva é obrigatório para excluir', 400);

        const exists = await prisma.reserva.findUnique({ where: { id } });
        if (!exists) throw new AppError("Reserva não encontrada", 404);

        await prisma.reserva.delete({ where: { id } });
    }
};

export default service;