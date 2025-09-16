import { z } from 'zod';

export const chatSchema = z.object({
	message: z.string().min(2, 'Message must be at least 2 characters long'),
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


export type IChatSchema = z.infer<typeof chatSchema>;