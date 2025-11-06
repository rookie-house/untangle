import { documents, sessions } from '@/lib/db/schema';
import { R2 } from '@/lib/r2';
import { UntangleADK } from '@/lib/untangle-adk';
import { parseAdkResponse, removeSpecialCharacters } from '@/lib/utils/parse';
import { WorkerAI } from '@/lib/worker-ai';
import type { IFileRaw, IFiles } from '@/types/untangle-adk.types';
import type { DbType } from '@/types/user';
import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';

export class UntangleADKService {
	public static readonly getSessions = async ({ ctx, userId }: { ctx: Context; userId: number }) => {
		const sessions = await UntangleADK.getInstance({ api: ctx.env.UNTANGLE_ADK_API }).listSessions({ userId });

		if (!sessions) {
			throw new Error('failed to fetch sessions');
		}

		if (sessions.sessions.length === 0) {
			throw new Error('no sessions found');
		}

		return sessions;
	};

	public static readonly createSession = async ({ ctx, userId }: { ctx: Context; userId: number }) => {
		const sessionId = crypto.randomUUID();
		const session = await UntangleADK.getInstance({ api: ctx.env.UNTANGLE_ADK_API }).createSession({ sessionId, userId });
		if (!session) {
			throw new Error('failed to create session');
		}

		const db = ctx.get('db').instance as DbType;

		if (!db) {
			throw new Error('Database not found');
		}

		await db.insert(sessions).values({ id: sessionId, title: 'New Session', userId });

		return session;
	};

	public static readonly start = async ({
		ctx,
		db,
		userId,
		message,
		// rawFiles,
		inlineFiles,
		sessionId,
	}: {
		ctx: Context;
		db: DbType;
		userId: number;
		message: string;
		sessionId?: string;
		// rawFiles?: {
		// 	key: string;
		// 	displayName: string;
		// 	fileUri: string;
		// 	mimeType: string;
		// }[];
		inlineFiles?: IFileRaw[];
	}) => {
		const adk = UntangleADK.getInstance({ api: ctx.env.UNTANGLE_ADK_API });
		if (!sessionId) {
			sessionId = crypto.randomUUID();
			const session = await adk.createSession({ sessionId, userId });
			if (!session) {
				throw new Error('Failed to create new session');
			}
		} else {
			const sessionExists = await adk.getSession({ userId, sessionId });
			if (!sessionExists) {
				const session = await adk.createSession({ sessionId, userId });
				if (!session) {
					throw new Error('Failed to create session with provided sessionId');
				}
			}
		}

		await db.insert(sessions).values({ id: sessionId, title: 'New Session', userId }).onConflictDoNothing();

		let files: IFileRaw[] = [];

		// if (rawFiles && rawFiles.length > 0) {
		// 	const documentUpdates = rawFiles.map((file) => {
		// 		console.log('Raw files to be processed:', file);
		// 		return db
		// 			.update(documents)
		// 			.set({ sessionId })
		// 			.where(and(eq(documents.id, file.key), eq(documents.userId, userId)));
		// 	});

		// 	await Promise.all(documentUpdates);

		// 	files = rawFiles.map((file) => ({
		// 		displayName: file.displayName,
		// 		fileUri: file.fileUri,
		// 		mimeType: file.mimeType,
		// 	}));
		// }

		if (inlineFiles && inlineFiles.length > 0) {
			files = inlineFiles.map((file) => ({
				displayName: file.displayName,
				data: file.data,
				mimeType: file.mimeType,
			}));
		}

		try {
			const response = await adk.runAgentInlineData({
				userId,
				sessionId,
				message,
				inlineFiles: Array.isArray(files) ? files : [],
				streaming: false,
			});

			let session_name = 'Untitled';
			try {
				session_name = await WorkerAI.run({
					ctx,
					input_text: removeSpecialCharacters(parseAdkResponse(response).slice(0, 50)),
					max_length: 10,
				});
			} catch (aiError) {
				console.warn('WorkerAI not available, using default session name:', aiError);
				session_name = 'Untitled';
			}

			await db
				.update(sessions)
				.set({ title: session_name })
				.where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));

			return response;
		} catch (error) {
			console.error('Error in UntangleADKService.start:', error);
			throw new Error(`Failed to start agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	public static readonly deleteSession = async ({
		ctx,
		db,
		userId,
		sessionId,
	}: {
		ctx: Context;
		db: DbType;
		userId: number;
		sessionId: string;
	}) => {
		const adk = UntangleADK.getInstance({ api: ctx.env.UNTANGLE_ADK_API });

		const existingSession = await adk.getSession({ userId, sessionId });

		if (!existingSession) {
			throw new Error('session not found');
		}

		const result = await adk.deleteSession({ userId, sessionId });
		if (!result) {
			throw new Error('failed to delete session');
		}

		await db.delete(sessions).where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
		return result;
	};
}
