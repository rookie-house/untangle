export interface WhatsAppWebhookPayload {
	object: "whatsapp_business_account";
	entry: WhatsAppWebhookEntry[];
}

export interface WhatsAppWebhookEntry {
	id: string;
	changes: WhatsAppWebhookChange[];
}

export interface WhatsAppWebhookChange {
	value: WhatsAppWebhookValue;
	field: string;
}

export interface WhatsAppWebhookValue {
	messaging_product: "whatsapp";
	metadata: WhatsAppMetadata;
	contacts?: WhatsAppContact[];
	messages?: WhatsAppMessage[];
}

export interface WhatsAppMetadata {
	display_phone_number: string;
	phone_number_id: string;
}

export interface WhatsAppContact {
	profile: {
		name: string;
	};
	wa_id: string;
}

export interface WhatsAppMessage {
	from: string;
	id: string;
	timestamp: string;
	type:
		| "text"
		| "image"
		| "document"
		| "audio"
		| "video"
		| "location"
		| "contacts";
	text?: {
		body: string;
	};
	image?: {
		id: string;
		mime_type: string;
		sha256: string;
		filename?: string;
	};
	document?: {
		id: string;
		mime_type: string;
		sha256: string;
		filename?: string;
	};
	audio?: {
		id: string;
		mime_type: string;
	};
	video?: {
		id: string;
		mime_type: string;
	};
}
