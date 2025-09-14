import { SignJWT } from 'jose';

export class R2 {
	private bucket: R2Bucket;
	private baseUrl?: string;
	private secret?: string;

	private constructor(config: { bucket: R2Bucket; baseUrl?: string; secret?: string }) {
		this.bucket = config.bucket;
		this.baseUrl = config.baseUrl;
		this.secret = config.secret;
	}

	// ✅ Singleton-style init
	public static getInstance(bucket: R2Bucket, baseUrl?: string, secret?: string) {
		return new R2({ bucket, baseUrl, secret });
	}

	// 🔹 Upload
	async upload(key: string, data: ArrayBuffer | ReadableStream | string, options?: R2PutOptions) {
		await this.bucket.put(key, data, options);
		return { success: true, key, url: this.getPermanentUrl(key) };
	}

	// 🔹 Get object
	async get(key: string) {
		const object = await this.bucket.get(key);
		if (!object) return null;

		return {
			key,
			body: object.body,
			size: object.size,
			uploaded: object.uploaded,
			httpMetadata: object.httpMetadata,
		};
	}

	// 🔹 Delete
	async delete(key: string) {
		await this.bucket.delete(key);
		return { success: true, deleted: key };
	}

	// 🔹 List
	async list(prefix?: string, limit = 100) {
		const list = await this.bucket.list({ prefix, limit });
		return list.objects.map((o) => ({
			key: o.key,
			size: o.size,
			uploaded: o.uploaded,
			url: this.getPermanentUrl(o.key),
		}));
	}

	// 🔹 Permanent URL (Worker route)
	getPermanentUrl(key: string): string | null {
		if (!this.baseUrl) return null;
		return `${this.baseUrl.replace(/\/$/, '')}/files/${encodeURIComponent(key)}`;
	}

	// 🔹 Signed URL (expiring)
	async getSignedUrl(key: string, expiresInSec: number): Promise<string | null> {
		if (!this.baseUrl || !this.secret) return null;

		const token = await new SignJWT({ key })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime(`${expiresInSec}s`)
			.sign(new TextEncoder().encode(this.secret));

		return `${this.baseUrl.replace(/\/$/, '')}/files/signed/${encodeURIComponent(key)}?token=${token}`;
	}
}
