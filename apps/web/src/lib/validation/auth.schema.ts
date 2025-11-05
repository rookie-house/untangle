import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string({ message: 'Email must be a string' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({ message: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters'),
});

export const signupSchema = authSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});
