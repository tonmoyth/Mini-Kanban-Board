import { z } from 'zod';

const createTaskValidation = z.object({
    body: z.object({
        title: z.string().trim().min(1, 'Title cannot be empty').max(255, 'Title cannot exceed 255 characters'),
        description: z.string().trim().max(2000, 'Description is too long').optional(),
    }),
});

const updateTaskValidation = z.object({
    body: z.object({
        title: z.string().trim().min(1, 'Title cannot be empty').max(255).optional(),
        description: z.string().trim().max(2000).optional(),
    }).refine(data => data.title !== undefined || data.description !== undefined, {
        message: 'At least one field (title or description) must be provided for update',
    }),
});

const moveTaskValidation = z.object({
    body: z.object({
        targetColumnId: z.string().uuid('Invalid column ID'),
        position: z.number().int().min(0, 'Position must be a non-negative integer'),
    }),
});

export const TaskValidation = {
    createTaskValidation,
    updateTaskValidation,
    moveTaskValidation,
};
