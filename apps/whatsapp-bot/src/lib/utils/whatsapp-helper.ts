import type { Context } from "hono";
import { chatWithADKSession, getAuthLink, uploadDocument } from "../api";
import type { WhatsAppMessage } from "@/types/whatsapp";
import { getSessionId } from "./helper";

/**
 * Sends a reply message to a user on WhatsApp.
 * @param param0 - The parameters for the reply message.
 */
export async function replyMessage({
	from,
	replyText,
	ctx,
}: {
	from: string;
	replyText: string;
	ctx: Context;
}) {
	try {
		const response = await fetch(
			`https://graph.facebook.com/v17.0/${ctx.env.PHONE_NUMBER_ID}/messages`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${ctx.env.WHATSAPP_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messaging_product: "whatsapp",
					to: from,
					text: { body: replyText },
				}),
			}
		);

		const result = await response.json();

		if (!response.ok) {
			console.error("❌ WhatsApp API error:", JSON.stringify(result, null, 2));
			throw new Error(
				`WhatsApp API returned ${response.status}: ${JSON.stringify(result)}`
			);
		}

		console.log(
			"✅ Message sent successfully:",
			JSON.stringify(result, null, 2)
		);
		return result;
	} catch (error) {
		console.error("❌ Failed to send WhatsApp message:", error);
		throw error;
	}
}

/**
 * Uploads media to WhatsApp.
 * @param param0 - The parameters for the media upload.
 * @returns The result of the media upload.
 */
export async function mediaUpload({
	mediaId,
	ctx,
}: {
	mediaId: string;
	ctx: Context;
}) {
	const mediaUrlResp = await fetch(
		`https://graph.facebook.com/v20.0/${mediaId}`,
		{
			headers: {
				Authorization: `Bearer ${ctx.env.WHATSAPP_TOKEN}`,
			},
		}
	);
	const mediaMeta = (await mediaUrlResp.json()) as {
		url: string;
	};
	if (!mediaMeta.url) throw new Error("No media URL found");
	const mediaResp = await fetch(mediaMeta.url, {
		headers: {
			Authorization: `Bearer ${ctx.env.WHATSAPP_TOKEN}`,
		},
	});
	return mediaResp;
}

/**
 * Sends a text message response to a user on WhatsApp.
 * @param param0 - The parameters for the text message response.
 * @returns The text message response.
 */
export async function textMessageResponse({
	token,
	name,
	phone,
	ctx,
	message,
}: {
	token: string | null;
	name: string | undefined;
	phone: string;
	ctx: Context;
	message: WhatsAppMessage;
}) {
	if (!token) {
		const { url } = await getAuthLink(phone, ctx);
		return `Hello ${name ?? "there"}, please authenticate here: ${url}`;
	} else {
		if (message.text && message.text.body) {
			const sessionId = await getSessionId(ctx, phone);
			const response = await chatWithADKSession(
				{
					message: message.text.body,
					sessionId: sessionId || undefined,
				},
				token,
				ctx
			);
			return response || "No response from chat session.";
		}
		return "⚠️ No text content found in message.";
	}
}

/**
 * Sends a media message response to a user on WhatsApp.
 * @param param0 - The parameters for the media message response.
 * @returns The media message response.
 */
export async function mediaMessageResponse({
	token,
	name,
	phone,
	message,
	ctx,
}: {
	token: string | null;
	name: string | undefined;
	phone: string;
	message: WhatsAppMessage;
	ctx: Context;
}) {
	try {
		if (!token) {
			const { url } = await getAuthLink(phone, ctx);
			return `Hello ${name ?? "there"}, please authenticate here: ${url}`;
		} else {
			const mediaId = message.image?.id || message.document?.id;

			if (!mediaId) {
				throw new Error("No media ID found in message");
			}

			const mediaResp = await mediaUpload({ mediaId, ctx });
			const arrayBuffer = await mediaResp.arrayBuffer();
			const fileName =
				message.image?.filename ||
				message.document?.filename ||
				(message.type === "image" ? "image.jpg" : "document.pdf");
			const fileType =
				message.image?.mime_type ||
				message.document?.mime_type ||
				(message.type === "image" ? "image/jpeg" : "application/pdf");
			const file = new File([arrayBuffer], fileName, {
				type: fileType,
			});
			const result = await uploadDocument(file, token, ctx);
			return `✅ File uploaded! Result: ${JSON.stringify(result)}`;
		}
	} catch (err: any) {
		return `❌ File upload failed: ${err instanceof Error ? err.message : String(err)}`;
	}
}
