import type { Context } from 'hono';
import type { AuthValidator, PhoneValidator } from '@/lib/validator/auth.validator';
import { AuthService } from '@/services/auth.service';
import { api_response } from '@/types/api-response';
import type { IUserContext } from '@/types/user';

export class AuthController {
	public static readonly signup = async (ctx: Context) => {
		try {
			// @ts-ignore
			const { email, password }: AuthValidator = ctx.req.valid('json');

			const sessionId = ctx.req.query('sessionId');

			const user = await AuthService.signup({ ctx, email, password, sessionId });

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
			// @ts-ignore
			const { email, password }: AuthValidator = ctx.req.valid('json');
			const sessionId = ctx.req.query('sessionId');
			const user = await AuthService.signin({ ctx, email, password, sessionId });
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
			const sessionId = ctx.req.query('sessionId');
			const { url } = await AuthService.googleAuthUrl({ ctx, sessionId });
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
			const { code, state } = ctx.req.query();
			if (!code) {
				return ctx.json(
					api_response({
						message: 'Authorization code is missing',
						is_error: true,
					}),
					400,
				);
			}

			const user = await AuthService.googleCallback({ ctx, code, state });
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

	public static readonly getAuthLink = async (ctx: Context) => {
		try {
			// @ts-ignore
			const { phoneNumber }: PhoneValidator = ctx.req.valid('json');

			const { url } = await AuthService.getWhatsAppAuthLink({ ctx, phoneNumber });
			return ctx.json(api_response({ message: 'Auth link generated', data: { url }, is_error: false }), 200);
		} catch (error) {
			return ctx.json(
				api_response({
					message: error instanceof Error ? error.message : 'unable to get whatsapp auth link',
					is_error: true,
				}),
				400,
			);
		}
	};

	public static readonly verifyWhatsAppAuth = async (ctx: Context) => {
		try {
			const phoneNumber = ctx.req.query('phoneNumber');
			if (!phoneNumber) {
				return ctx.json(
					api_response({
						message: 'Phone number is required',
						is_error: true,
					}),
					400,
				);
			}
			const user = await AuthService.verifyWhatsAppAuth({ ctx, phoneNumber });
			return ctx.json(api_response({ message: 'User signed in', data: user }));
		} catch (error) {
			return ctx.json(
				api_response({
					message: error instanceof Error ? error.message : 'whatsapp auth failed',
					is_error: true,
				}),
				400,
			);
		}
	};

	public static readonly ping = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}

			return ctx.json(api_response({ message: 'user fetched successfully', data: user, is_error: false }), 200);
		} catch (error) {
			return ctx.json(
				api_response({
					message: error instanceof Error ? error.message : 'fetching user failed',
					is_error: true,
				}),
				400,
			);
		}
	};
}
