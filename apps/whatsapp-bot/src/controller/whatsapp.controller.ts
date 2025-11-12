import type { Context } from "hono";
import type { WhatsAppWebhookPayload } from "@/types/whatsapp";
import { checkToken } from "@/lib/utils/helper";
import { getAuthLink } from "@/lib/api";
import {
	mediaMessageResponse,
	replyMessage,
	textMessageResponse,
} from "@/lib/utils/whatsapp-helper";

export class WhatsAppController {
	public static readonly getWebhook = async (ctx: Context) => {
		const VERIFY_TOKEN = ctx.env.VERIFY_TOKEN;
		const mode = ctx.req.query("hub.mode");
		const token = ctx.req.query("hub.verify_token");
		const challenge = ctx.req.query("hub.challenge");

		if (mode && token) {
			if (mode === "subscribe" && token === VERIFY_TOKEN) {
				return ctx.text(challenge ?? "", 200);
			} else {
				return ctx.text("Forbidden", 403);
			}
		}
		return ctx.text("Bad Request", 400);
	};

	public static readonly postWebhook = async (ctx: Context) => {
		console.log("hello");
		const body = await ctx.req.json<WhatsAppWebhookPayload>();
		const change = body?.entry?.[0]?.changes?.[0]?.value;
		const message = change?.messages?.[0];
		const contact = change?.contacts?.[0];

		const phone = message?.from || contact?.wa_id;

		const name = contact?.profile?.name;
		console.log("📩 Incoming webhook:", JSON.stringify(body, null, 2));

		try {
			if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
				const message = body.entry[0].changes[0].value.messages[0];

				if (!message || !phone) {
					console.warn("⚠️ Missing message or phone number");
					return ctx.text("OK", 200);
				}

				let replyText = "⚠️ Unsupported message type.";

				const token = await checkToken(phone, ctx);
				if (!token) {
					const { url } = await getAuthLink(phone, ctx);
					console.log("🔗 Sending auth link:", url);
					replyText = `Hello ${name ?? "there"}, please authenticate here: ${url}`;
				}

				if (message.type === "text") {
					replyText = await textMessageResponse({
						token,
						name,
						phone,
						ctx,
						message,
					});
				}

				if (message.type === "document" || message.type === "image") {
					replyText = await mediaMessageResponse({
						token,
						name,
						phone,
						message,
						ctx,
					});
				}

				console.log("📤 Sending reply:", replyText);
				await replyMessage({ from: phone, replyText, ctx });

				console.log("✅ Reply sent!");
			}
		} catch (err: any) {
			console.error("❌ Error handling message:", err?.message);
			console.error("Full error:", err);
		}
		return ctx.text("OK", 200);
	};
}
