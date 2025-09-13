import type { Context } from 'hono';
import type { AuthValidator } from '@/lib/validator/auth.validator';
import { AuthService } from '@/services/auth.service';
import { api_response } from '@/types/api-response';

export class AuthController {
	public static readonly signup = async (ctx: Context) => {
		try {
			const { email, password }: AuthValidator = ctx.req.valid('json');
			const user = await AuthService.signup({ ctx, email, password });
			return ctx.json(
				api_response({
					message: 'User created successfully',
					data: user,
					is_error: false,
				}),
				201,
			);
		} catch (error) {
			return ctx.json(api_response({ message: error instanceof Error ? error.message : 'signup failed', is_error: true }), 400);
		}
	};
	public static readonly signin = async (ctx: Context) => {
		try {
			const { email, password }: AuthValidator = ctx.req.valid('json');
			const user = await AuthService.signin({ ctx, email, password });
			return ctx.json(
				api_response({
					message: 'User signed in',
					data: user,
					is_error: false,
				}),
				200,
			);
		} catch (error) {
			return ctx.json(api_response({ message: error instanceof Error ? error.message : 'signin failed', is_error: true }), 400);
		}
	};
	public static readonly google = async (ctx: Context) => {
		try {
			const url = AuthService.googleAuthUrl({ ctx });
			return ctx.json({ url });
		} catch (error) {
			return ctx.json(
				api_response({
					message: error instanceof Error ? error.message : 'unable to redirect to google',
					is_error: true,
				}),
				400,
			);
		}
	};
	public static readonly googleCallback = async (ctx: Context) => {
		try {
			const { code } = ctx.req.query();

			if (!code) {
				return ctx.json(
					api_response({
						message: 'Authorization code is missing',
						is_error: true,
					}),
					400,
				);
			}

			const user = await AuthService.googleCallback({ ctx, code });
			return ctx.json(api_response({ message: 'User signed in', data: user }));
		} catch (error) {
			return ctx.json(
				api_response({
					message: error instanceof Error ? error.message : 'google callback failed',
					is_error: true,
				}),
				400,
			);
		}
	};
}
