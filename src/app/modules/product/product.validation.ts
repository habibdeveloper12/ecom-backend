import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    id: z.string().min(1).max(255).optional(),
    name: z.string().min(1).max(255),
    email: z.string().email(),
    role: z.string().optional().default('user'),
    password: z.string().min(1).max(255),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
