import { z } from 'zod';

const addMemberValidation = z.object({
    body: z.object({
        email: z.string().email('Invalid email address').trim().toLowerCase(),
        role: z.literal('MEMBER').default('MEMBER'),
    }),
});

export const MemberValidation = {
    addMemberValidation,
};
