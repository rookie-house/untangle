import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { hono } from './lib/hono';
import routes from './routes';

const app = hono();

app.use(logger());
app.use('*', async (c, next) => {
	const corsMiddleware = cors({
		origin: ['http://localhost:3000', 'https://untangle.rookie.house'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	return corsMiddleware(c, next);
});
app.use(prettyJSON());

app.get('/', (c) => c.text('Hello Hono!'));


app.route('/api', routes);

app.get('/health', (ctx) => ctx.json({ status: 'ok' }));

export default app;
