import AppError from '../utils/AppError.js';

function errorMiddleware(error, req, res, next) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message,
        });
    }

    console.error(error); // ajuda a identificar erros ainda tratados

    return res.status(500).json({
        error: 'Internal Server Error',
    });
}

export default errorMiddleware;