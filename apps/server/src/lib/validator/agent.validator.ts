import { zValidator } from '@hono/zod-validator';
import z from 'zod';
import { File } from 'node:buffer';

const fileSchema = z.object({
	name: z.string(),
	type: z.string(),
	size: z.number().optional(),
	data: z.string().optional(), // Base64 string or data URL from FileReader.readAsDataURL()
});

const firstSchema = z.object({
	message: z.string({}).min(2, 'Message must be at least 2 characters long'),
	sessionId: z.string().optional(),
	img: z.array(fileSchema).optional(), // Array of file objects with base64 data
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
