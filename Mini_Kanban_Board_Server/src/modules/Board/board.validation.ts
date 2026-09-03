import { z } from 'zod';

const createBoardValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name cannot exceed 100 characters'),
    }),
});

const updateBoardValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name cannot exceed 100 characters'),
    }),
});

export const BoardValidation = {
    createBoardValidation,
    updateBoardValidation,
};
