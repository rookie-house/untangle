type MimeCategory = 'application' | 'image' | 'video' | 'audio' | 'text' | 'font';

export function getMimeTypeFromCategory(category: 'pdf' | 'image' | 'other'): `${MimeCategory}/${string}` {
	const MIME_MAP: Record<'pdf' | 'image' | 'other', `${MimeCategory}/${string}`> = {
		pdf: 'application/pdf',
		image: 'image/png',
		other: 'application/octet-stream',
	};
	return MIME_MAP[category] || 'application/octet-stream';
}
