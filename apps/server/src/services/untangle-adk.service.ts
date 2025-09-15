import { documents } from '@/lib/db/schema';
import { R2 } from '@/lib/r2';
import { UntangleADK } from '@/lib/untangle-adk';
import type { IFiles } from '@/types/untangle-adk.types';
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
		return session;
	};

	// TODO: add session title
	public static readonly start = async ({
		ctx,
		db,
		userId,
		message,
		rawFiles,
		sessionId,
	}: {
		ctx: Context;
		db: DbType;
		userId: number;
		message: string;
		sessionId?: string;
		rawFiles?: {
			id: string;
			displayName: string;
			fileUri: string;
			mimeType: string;
		}[];
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

		let files: IFiles[] = [];

		if (rawFiles && rawFiles.length > 0) {
			const documentUpdates = rawFiles.map((file) =>
				db
					.update(documents)
					.set({ sessionId })
					.where(and(eq(documents.r2_key, file.id), eq(documents.userId, userId))),
			);

			await Promise.all(documentUpdates);

			files = rawFiles.map((file) => ({
				displayName: file.displayName,
				fileUri: file.fileUri,
				mimeType: file.mimeType,
			}));
		}

		const response = await adk.runAgent({
			userId,
			sessionId,
			message,
			rawFiles: files,
		});

		return response;
	};

	public static readonly deleteSession = async ({ ctx, userId, sessionId }: { ctx: Context; userId: number; sessionId: string }) => {
		const adk = UntangleADK.getInstance({ api: ctx.env.UNTANGLE_ADK_API });

		const existingSession = await adk.getSession({ userId, sessionId });

		if (!existingSession) {
			throw new Error('session not found');
		}

		const result = await adk.deleteSession({ userId, sessionId });
		if (!result) {
			throw new Error('failed to delete session');
		}
		return result;
	};
}
