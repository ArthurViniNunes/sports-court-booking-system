import { response } from 'express';
import prisma from '../database/prisma.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const service = {
    register: async (jogador) => {
        if (!jogador.nome || !jogador.email || !jogador.telefone || !jogador.senha) {
            throw new AppError('Nome, email, telefone e senha são obrigatórios', 400);
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


        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(jogador.senha, salt);

        const player = await prisma.jogador.create({ 
            data: {
                nome: jogador.nome,
                email: jogador.email,
                telefone: jogador.telefone,
                senha: senhaHash,
                isAdmin: false // Garante que ninguém se cadastre como admin pela rota
            } 
        });

        if (!player) {
            throw new AppError('Erro ao criar jogador', 500);
        }

        // Remove a senha e a flag de admin do retorno por segurança.
        const { senha, isAdmin, ...playerSemSenha } = player;
        return playerSemSenha;
    },
    login: async (email, senha) => {
        if (!email || !senha) throw new AppError('Email e senha são obrigatórios', 400);

        const jogador = await prisma.jogador.findUnique({ where: { email } });
        if (!jogador) throw new AppError('Credenciais inválidas', 401);

        const senhaValida = await bcrypt.compare(senha, jogador.senha);
        if (!senhaValida) throw new AppError('Credenciais inválidas', 401);

        const token = jwt.sign(
            { id: jogador.id, isAdmin: jogador.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return { 
            token, 
            jogador: { id: jogador.id, nome: jogador.nome, isAdmin: jogador.isAdmin } 
        };
    },

}

export default service;