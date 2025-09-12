import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import routes from "./routes";

const app = new Hono();

app.use(logger());
app.use("*", async (c, next) => {
	const corsMiddleware = cors({
		origin: ["http://localhost:3000"],
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		allowHeaders: ["Content-Type", "Authorization"],
	});
	return corsMiddleware(c, next);
});
app.use(prettyJSON());

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/api", routes);

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
