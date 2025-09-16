export class R2 {
	private bucket: R2Bucket;
	private baseUrl?: string;

	private constructor(config: { bucket: R2Bucket; baseUrl?: string }) {
		this.bucket = config.bucket;
		this.baseUrl = config.baseUrl;
	}

	// ✅ Singleton-style init
	public static getInstance(bucket: R2Bucket, baseUrl?: string) {
		return new R2({ bucket, baseUrl });
	}

	// 🔹 Upload (supports File, ArrayBuffer, ReadableStream, string)
	async upload(key: string, data: File | ArrayBuffer | ReadableStream | string, options?: R2PutOptions) {
		let body: ArrayBuffer | ReadableStream | string;

		if (data instanceof File) {
			body = data.stream();
			const existingContentType = options?.httpMetadata instanceof Headers 
				? options.httpMetadata.get('content-type')
				: options?.httpMetadata?.contentType;
			
			options = {
				...options,
				httpMetadata: {
					...options?.httpMetadata,
					contentType: existingContentType ?? data.type,
				},
			};
		} else {
			body = data;
		}

		const res = await this.bucket.put(key, body, options);

		return {
			success: true,
			key,
			uploadedAt: res?.uploaded,
			url: this.getPermanentUrl(key),
		};
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

	// 🔹 Permanent URL (Worker route / CDN / CloudFront)
	getPermanentUrl(key: string): string | null {
		if (!this.baseUrl) return null;
		return `${this.baseUrl.replace(/\/$/, '')}/${encodeURIComponent(key)}`;
	}
}
