import { Hono, type Context } from "hono";
import type { Env } from "./types/bindings";
import { WhatsAppController } from "./controller/whatsapp.controller";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (ctx: Context) => ctx.text("Civica is running!"));

app.get("/webhook", WhatsAppController.getWebhook);

app.post("/webhook", WhatsAppController.postWebhook);

export default app;
