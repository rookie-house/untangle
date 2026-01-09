import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { hono } from './lib/hono';
import routes from './routes';
import { Scalar } from '@scalar/hono-api-reference';
import { openApiSpec } from './lib/utils/openapi';

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

app.get('/openapi.json', (c) => c.json(openApiSpec));
app.get('/', (c) => c.text('Hello Hono!'));

app.get(
	'/docs',
	Scalar((c) => {
		return {
			url: '/openapi.json',
			title: 'Untangle API Docs',
			description: 'API documentation for the Untangle application.',
			version: '1.0.0',
			darkMode: true,
			isEditable: false,
			hideDownloadButton: true,
			theme: 'saturn',
		};
	}),
);

app.route('/api', routes);

app.get('/health', (ctx) => ctx.json({ status: 'ok' }));

export default app;
