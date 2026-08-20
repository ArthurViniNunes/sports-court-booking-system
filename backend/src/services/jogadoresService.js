import { response } from 'express';
import prisma from '../database/prisma.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const service = {

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

create: async (data) => {
    if (!data.nome || !data.email || !data.telefone) {
        throw new AppError('Nome, email e telefone são obrigatórios', 400);
    }

    // Valida o formato do email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new AppError('Email inválido', 400);
    }

    // Verifica se o email já está cadastrado
    const emailExists = await prisma.jogador.findUnique({
        where: { email: data.email }
    });
    if (emailExists) {
        throw new AppError('Email já cadastrado', 400);
    }

    // Gera uma senha padrão para o jogador criado pelo admin
    const senhaHash = await bcrypt.hash('123456', 10);

    return await prisma.jogador.create({
        data: {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            senha: senhaHash,
            isAdmin: false
        }
    });
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