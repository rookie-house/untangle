import { zValidator } from '@hono/zod-validator';
import z from 'zod';

const authSchema = z.object({
	email: z
		.string({
			message: 'Email must be a string',
		})
		.email('Please enter a valid email address')
		.toLowerCase()
		.trim(),
	password: z
		.string({
			message: 'Password must be a string',
		})
		.min(8, 'Password must be at least 8 characters long')
		.max(128, 'Password must be less than 128 characters'),
});

const phoneNumberSchema = z.object({
	phoneNumber: z.string().min(10).max(15),
});

export const phoneValidator = zValidator('json', phoneNumberSchema, (result, ctx) => {
	if (!result.success) {
		return ctx.json(
			{
				error: true,
				message: 'Validation failed',
				data: {
					errors: result.error.issues.map((err) => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				},
			},
			400,
		);
	}
});

export const authValidator = zValidator('json', authSchema, (result, ctx) => {
	if (!result.success) {
		return ctx.json(
			{
				error: true,
				message: 'Validation failed',
				data: {
					errors: result.error.issues.map((err) => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				},
			},
			400,
		);
	}
});

export type AuthValidator = z.infer<typeof authSchema>;
export type PhoneValidator = z.infer<typeof phoneNumberSchema>;
