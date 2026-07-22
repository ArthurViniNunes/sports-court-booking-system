import asyncHandler from '../middlewares/asyncHandler.js';

function wrapController(controller) {
    return Object.fromEntries(
        Object.entries(controller).map(([key, handler]) => [
            key,
            asyncHandler(handler)
        ])
    );
}

export default wrapController;