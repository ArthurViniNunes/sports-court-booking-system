import { response } from 'express';
import prisma from '../database/prisma.js';
import AppError from '../utils/AppError.js';

const service = {
    create: async (jogador) => {
        if (!jogador.nome || !jogador.email || !jogador.telefone) {
            throw new AppError('Nome, email e telefone são obrigatórios', 400);
        }

        // Esse é um regex simples para validar o formato do email. Ele verifica se o email contém um "@" e um "." após o "@".
        // (Novamente, algo mais avançado, náo se preocupa com isso agora, mas regex para email pode ser bem complexo)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(jogador.email)) {
            throw new AppError('Email inválido', 400);
        }

        const emailExists = await prisma.jogador.findUnique({ where: { email: jogador.email } });

        if (emailExists) {
            throw new AppError('Email já cadastrado', 400);
        }

        const player = await prisma.jogador.create({ data: jogador });

        if (!player) {
            throw new AppError('Erro ao criar jogador', 500);
        }

        return player;
    },

    getAll: async () => {
        const players = await prisma.jogador.findMany();
        return players;
    },

    getById: async (id) => {
        if (!id) {
            throw new AppError('ID do jogador é obrigatório para buscar', 400);
        }

        const player = await prisma.jogador.findUnique({ where: { id } });

        if (!player) {
            throw new AppError('Jogador não encontrado', 404);
        }
        return player;
    },

    update: async (id, jogador) => {
        if (!id) {
            throw new AppError('ID do jogador é obrigatório para atualizar', 400);
        }

        if (!jogador || Object.keys(jogador).length === 0) {
            throw new AppError('Dados do jogador são obrigatórios para atualizar', 400);
        }

        const data = {};

        if (jogador.nome !== undefined)
            data.nome = jogador.nome;

        if (jogador.email !== undefined)
            data.email = jogador.email;

        if (jogador.telefone !== undefined)
            data.telefone = jogador.telefone;

        const exists = await prisma.jogador.findUnique({
            where: { id }
        });

        if (!exists) {
            throw new AppError("Jogador não encontrado", 404);
        }

        if (jogador.email) {

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(jogador.email)) {
                throw new AppError("Email inválido", 400);
            }

            const emailExists = await prisma.jogador.findUnique({
                where: {
                    email: jogador.email
                }
            });

            if (emailExists && emailExists.id !== id) {
                throw new AppError('Email já cadastrado', 400);
            }
        }

        return prisma.jogador.update({ where: { id }, data: data });
    },

    delete: async (id) => {
        if (!id) {
            throw new AppError('ID do jogador é obrigatório para excluir', 400);
        }

        const exists = await prisma.jogador.findUnique({
            where: { id }
        });

        if (!exists) {
            throw new AppError("Jogador não encontrado", 404);
        }

        await prisma.jogador.delete({
            where: { id }
        });
    }
};

export default service;