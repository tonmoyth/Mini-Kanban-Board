import { z } from 'zod';

const createColumnValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name cannot exceed 100 characters'),
    }),
});

const renameColumnValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name cannot exceed 100 characters'),
    }),
});

const reorderColumnValidation = z.object({
    body: z.object({
        position: z.number().int().min(0, 'Position must be a positive integer'),
    }),
});

export const ColumnValidation = {
    createColumnValidation,
    renameColumnValidation,
    reorderColumnValidation,
};
