import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { AuthService } from '@/services/auth.service';
import { initializeDatabase, validateEnvironment } from '@/lib/utils/helper';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const authMiddleware = createMiddleware(async (ctx: Context, next) => {
	const headers = ctx.req.header('Authorization');
	if (!headers) {
		return ctx.json({ error: 'Unauthorized' }, 401);
	}

	const token = headers.split(' ')[1];

	if (!token) {
		return ctx.json({ error: 'Unauthorized' }, 401);
	}

	const data = await AuthService.verifyToken({ token: token, ctx: ctx });

	if (!data) {
		return ctx.json({ error: 'Unauthorized' }, 401);
	}

	const envValidation = validateEnvironment(ctx);
	if (!envValidation.isValid) {
		console.error('Missing environment variables:', envValidation.missingVars);
		return ctx.json(
			{
				error: true,
				message: 'Server configuration error',
				data: null,
			},
			500,
		);
	}

	// Initialize database connection
	const { db, error: dbError } = await initializeDatabase(ctx);
	if (dbError || !db) {
		return ctx.json(
			{
				error: true,
				message: 'Database connection failed',
			},
			500,
		);
	}

	const userData = await db.select().from(users).where(eq(users.id, data.id)).get();

	if (!userData) {
		return ctx.json({ error: 'User not found' }, 404);
	}

	ctx.set('user', {
		id: userData.id,
		email: userData.email,
	});

	ctx.set('db', {
		instance: db,
	});

	await next();
});
