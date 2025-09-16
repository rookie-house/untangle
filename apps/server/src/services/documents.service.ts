import { documents } from '@/lib/db/schema';
import { R2 } from '@/lib/r2';
import type { DbType } from '@/types/user';
import { eq, and } from 'drizzle-orm';
import type { Context } from 'hono';

export class DocumentsService {
	public static readonly uploadFile = async ({
		body,
		ctx,
		fileName,
		type,
		userId,
		db,
	}: {
		ctx: Context;
		fileName: string;
		body: File;
		userId: number;
		db: DbType;
		type: 'image' | 'pdf' | 'other';
	}) => {
		const keyId = crypto.randomUUID();

		const r2 = R2.getInstance(ctx.env.BUCKET, ctx.env.BASE_URL);
		console.log('r2:', ctx.env.BUCKET, ctx.env.BASE_URL);

		const mimeType = type === 'image' ? 'image/png' : type === 'pdf' ? 'application/pdf' : 'application/octet-stream';
		const uploadResult = await r2.upload(keyId, body, { httpMetadata: { contentType: mimeType } });

		const { key, url, success } = uploadResult;

		if (!success || !key) {
			throw new Error('File upload failed');
		}
		if (!url) {
			throw new Error('File retrieval failed');
		}

		const document = await db
			.insert(documents)
			.values({
				url: url,
				userId: userId,
				title: fileName,
				type: type,
				r2_key: keyId,
			})
			.returning();

		if (!document) {
			throw new Error('Document record creation failed');
		}

		return { document };
	};

	public static readonly getDocumentsByUserId = async ({
		userId,
		db,
		pageSize,
		offset,
	}: {
		userId: number;
		db: DbType;
		pageSize: number;
		offset: number;
	}) => {
		const documentsList = await db.select().from(documents).where(eq(documents.userId, userId)).limit(pageSize).offset(offset);

		if (!documentsList) {
			throw new Error('No documents found for the user');
		}

		return { documents: documentsList };
	};

	public static readonly getDocumentById = async ({
		ctx,
		documentId,
		db,
		userId,
	}: {
		ctx: Context;
		documentId: number;
		userId: number;
		db: DbType;
	}) => {
		const document = await db
			.select()
			.from(documents)
			.where(eq(documents.id, documentId) && eq(documents.userId, userId))
			.get();

		if (!document) {
			throw new Error('Document not found');
		}

		return { document };
	};

	public static readonly getDocumentsBySessionId = async ({
		sessionId,
		db,
		userId,
		pageSize,
		offset,
	}: {
		sessionId: string;
		userId: number;
		db: DbType;
		pageSize: number;
		offset: number;
	}) => {
		const documentsList = await db
			.select()
			.from(documents)
			.where(and(eq(documents.sessionId, sessionId), eq(documents.userId, userId)))
			.limit(pageSize)
			.offset(offset);

		if (!documentsList) {
			throw new Error('No documents found for the session');
		}

		return { documents: documentsList };
	};
}
