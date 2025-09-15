import { zValidator } from '@hono/zod-validator';
import z from 'zod';

const firstSchema = z.object({
	message: z.string({}).min(2, 'Message must be at least 2 characters long'),
	sessionId: z.string().optional(),
	img: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				url: z.string().url(),
				type: z.enum(['pdf', 'image', 'other']),
			}),
		)
		.optional(),
});

export const firstChatValidator = zValidator('json', firstSchema, (result, ctx) => {
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

export type firstChatValidator = z.infer<typeof firstSchema>;
