import { zValidator } from '@hono/zod-validator';
import z from 'zod';
import { File } from 'node:buffer';

const fileSchema = z.object({
	name: z.string(),
	type: z.string(),
	size: z.number().optional(),
	data: z.union([z.string(), z.instanceof(Buffer), z.instanceof(File), z.instanceof(Blob)]).optional(),
});

const firstSchema = z.object({
	message: z.string({}).min(2, 'Message must be at least 2 characters long'),
	sessionId: z.string().optional(),
	img: z.union([z.array(fileSchema), z.array(z.instanceof(Buffer).or(z.instanceof(File)).or(z.instanceof(Blob)))]).optional(),
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
