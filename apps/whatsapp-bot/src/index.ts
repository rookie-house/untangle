import { Hono, type Context } from "hono";
import type { Env } from "./types/bindings";
import { chatWithADKSession, getAuthLink, uploadDocument } from "./lib/api";
import { checkToken, getSessionId } from "./lib/utils/helper";

// Cloudflare Worker Entry
const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.text("Civica is running!"));

// ✅ Webhook verification (Meta requirement)
app.get("/webhook", (c) => {
	const VERIFY_TOKEN = c.env.VERIFY_TOKEN;
	const mode = c.req.query("hub.mode");
	const token = c.req.query("hub.verify_token");
	const challenge = c.req.query("hub.challenge");

	if (mode && token) {
		if (mode === "subscribe" && token === VERIFY_TOKEN) {
			return c.text(challenge ?? "", 200);
		} else {
			return c.text("Forbidden", 403);
		}
	}
	return c.text("Bad Request", 400);
});

// ✅ Handle incoming WhatsApp messages
app.post("/webhook", async (ctx: Context) => {
	const body = await ctx.req.json();
	const change = body?.entry?.[0]?.changes?.[0]?.value;
	const message = change?.messages?.[0];
	const contact = change?.contacts?.[0];

	// ✅ Phone number
	const phone = message?.from || contact?.wa_id;

	// ✅ Contact name
	const name = contact?.profile?.name;
	console.log("📩 Incoming webhook:", JSON.stringify(body, null, 2));

	try {
		if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
			const message = body.entry[0].changes[0].value.messages[0];
			const from = message.from;
			const phone_number_id =
				body.entry[0].changes[0].value.metadata.phone_number_id;

			let replyText = "⚠️ Unsupported message type.";

			const token = await checkToken(ctx, phone);
			if (!token) {
				const { url } = await getAuthLink(phone);
				replyText = `Hello ${name}, please authenticate here: ${url}`;
			}

			// If text message
			if (message.type === "text") {
				if (!token) {
					const { url } = await getAuthLink(phone);
					replyText = `Hello ${name}, please authenticate here: ${url}`;
				} else {
					if (message.text && message.text.body) {
						const sessionId = await getSessionId(ctx, phone);
						const response = await chatWithADKSession(
							{ message: message.text.body, sessionId: sessionId || undefined },
							token
						);
						replyText = response || "No response from chat session.";
					}
				}
			}

			if (message.type === "document" || message.type === "image") {
				try {
					if (!token) {
						const { url } = await getAuthLink(phone);
						replyText = `Hello ${name}, please authenticate here: ${url}`;
					} else {
						const mediaId = message.image?.id || message.document?.id;

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
						const result = await uploadDocument(file, token);
						replyText = `✅ File uploaded! Result: ${JSON.stringify(result)}`;
					}
				} catch (err: any) {
					replyText = `❌ File upload failed: ${err instanceof Error ? err.message : String(err)}`;
				}
			}

			// Send reply back to WhatsApp
			await fetch(
				`https://graph.facebook.com/v17.0/${phone_number_id}/messages`,
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

			console.log("✅ Reply sent!");
		}
	} catch (err: any) {
		console.error("❌ Error handling message:", err?.message);
	}

	return ctx.text("OK", 200);
});

export default app;