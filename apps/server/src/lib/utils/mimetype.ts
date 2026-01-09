type MimeCategory = 'application' | 'image' | 'video' | 'audio' | 'text' | 'font';

export function parseMimeType(type: 'pdf' | 'image' | 'other'): string {
	const MIME_MAP: Record<string, `${MimeCategory}/${string}`> = {
    pdf: 'application/pdf',
    image: 'image/png',
    other: 'application/octet-stream',
  };
  return MIME_MAP[type] || 'application/octet-stream';
}