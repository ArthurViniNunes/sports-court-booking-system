import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError('Token não fornecido', 401);

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new AppError('Token inválido ou expirado', 401);
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        throw new AppError('Acesso negado. Apenas administradores.', 403);
    }
    next();
};