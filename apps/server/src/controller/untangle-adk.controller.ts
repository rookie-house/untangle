import type { firstChatValidator } from '@/lib/validator/agent.validator';
import { UntangleADKService } from '@/services/untangle-adk.service';
import { api_response } from '@/types/api-response';
import type { DbType, IUserContext } from '@/types/user';
import type { Context } from 'hono';

export class UntangleADKController {
	public static readonly getSessions = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}

			const sessions = await UntangleADKService.getSessions({ ctx, userId: user.id });

			return ctx.json(api_response({ data: sessions, message: 'Sessions fetched successfully' }));
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};

	public static readonly createSession = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}

			const session = await UntangleADKService.createSession({ ctx, userId: user.id });

			return ctx.json(api_response({ data: session, message: 'Session created successfully' }));
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};

	public static readonly start = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;
			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}
			// @ts-ignore
			const body = ctx.req.valid('json') as firstChatValidator;

			const db = ctx.get('db').instance as DbType;

			if (!db) {
				return ctx.json(api_response({ message: 'Database not found', is_error: true }), 404);
			}

			const messageResponse = await UntangleADKService.start({
				ctx,
				db,
				userId: user.id,
				message: body.message,
				sessionId: body.sessionId,
				// rawFiles:
				// 	body.img?.map((item) => ({
				// 		key: item.key,
				// 		displayName: item.title,
				// 		fileUri: item.url,
				// 		mimeType: item.type === 'image' ? 'image/*' : item.type === 'pdf' ? 'application/pdf' : 'application/octet-stream',
				// 	})) || [],

				inlineFiles: await Promise.all((Array.isArray(body.img) ? body.img : []).map(async (item) => {
					let base64Data = '';
					if ('data' in item) {
						const itemData = item.data;
						if (typeof itemData === 'string') {
							base64Data = itemData;
						} else if (itemData instanceof Buffer) {
							base64Data = itemData.toString('base64');
						} else if (itemData instanceof File || itemData instanceof Blob) {
							base64Data = Buffer.from(await itemData.arrayBuffer()).toString('base64');
						}
					} else if (item instanceof Buffer) {
						base64Data = item.toString('base64');
					} else if (item instanceof File || item instanceof Blob) {
						base64Data = Buffer.from(await item.arrayBuffer()).toString('base64');
					}
					return {
						displayName: 'name' in item ? item.name : 'file',
						data: base64Data,
						mimeType: 'type' in item ? (item.type === 'image' ? 'image/*' : item.type === 'pdf' ? 'application/pdf' : 'application/octet-stream') : 'application/octet-stream',
					};
				})),
			});

			return ctx.json(api_response({ data: messageResponse, message: 'chat fetched successfully' }));
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};

	public static readonly deleteSession = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;
			const db = ctx.get('db').instance as DbType;

			if (!db) {
				return ctx.json(api_response({ message: 'Database not found', is_error: true }), 404);
			}

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}

			const sessionId = ctx.req.param('id');
			const result = await UntangleADKService.deleteSession({ ctx, db, userId: user.id, sessionId });

			return ctx.json(api_response({ data: result, message: 'Session deleted successfully' }));
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};
}


