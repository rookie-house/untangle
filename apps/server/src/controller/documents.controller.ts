import type { Context } from 'hono';
import { api_response } from '@/types/api-response';
import type { DbType, IUserContext } from '@/types/user';
import { DocumentsService } from '@/services/documents.service';

export class DocumentsController {
	public static readonly upload = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}

			const db = ctx.get('db').instance as DbType;

			if (!db) {
				return ctx.json(api_response({ message: 'Database not found', is_error: true }), 404);
			}

			const form = await ctx.req.formData();
			const file = form.get('file') as File | null;

			if (!(file instanceof File)) {
				return ctx.json({ error: 'No file uploaded' }, 400);
			}

			const document = await DocumentsService.uploadFile({
				ctx,
				fileName: file.name,
				body: file,
				userId: user.id,
				type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
				db,
			});

			return ctx.json(
				api_response({
					message: 'File uploaded successfully',
					data: document,
					is_error: false,
				}),
				201,
			);
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};

	public static readonly getDocuments = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}

			const db = ctx.get('db').instance as DbType;

			if (!db) {
				return ctx.json(api_response({ message: 'Database not found', is_error: true }), 404);
			}

			const { pageSize, offset } = ctx.req.query();

			const documents = await DocumentsService.getDocumentsByUserId({
				userId: user.id,
				db: db,
				pageSize: Number(pageSize) || 10,
				offset: Number(offset) || 0,
			});

			return ctx.json(
				api_response({
					message: 'Documents retrieved successfully',
					data: documents,
					is_error: false,
				}),
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};

	public static readonly getDocumentById = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}
			const db = ctx.get('db').instance as DbType;

			if (!db) {
				return ctx.json(api_response({ message: 'Database not found', is_error: true }), 404);
			}

			const { id } = ctx.req.param();

			if (!id) {
				return ctx.json(api_response({ message: 'Document ID is required', is_error: true }), 400);
			}

			const document = await DocumentsService.getDocumentById({ ctx, documentId: Number(id), userId: user.id, db });

			return ctx.json(
				api_response({
					message: 'Document retrieved successfully',
					data: document,
					is_error: false,
				}),
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};

	public static readonly getDocumentsBySession = async (ctx: Context) => {
		try {
			const user = ctx.get('user') as IUserContext;

			if (!user) {
				return ctx.json(api_response({ message: 'Unauthorized', is_error: true }), 401);
			}
			const db = ctx.get('db').instance as DbType;

			if (!db) {
				return ctx.json(api_response({ message: 'Database not found', is_error: true }), 404);
			}

			const { sessionId } = ctx.req.param();

			if (!sessionId) {
				return ctx.json(api_response({ message: 'Session ID is required', is_error: true }), 400);
			}

			const { pageSize, offset } = ctx.req.query();

			const documents = await DocumentsService.getDocumentsBySessionId({
				sessionId: sessionId,
				userId: user.id,
				db,
				pageSize: Number(pageSize) || 10,
				offset: Number(offset) || 0,
			});

			return ctx.json(
				api_response({
					message: 'Documents retrieved successfully',
					data: documents,
					is_error: false,
				}),
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(api_response({ message: error.message, is_error: true }), 500);
			}
		}
	};
}
