import { hono } from '@/lib/hono';
import authRoute from './auth.routes';
import documentRoute from './documents.routes';
import { DevController } from '@/controller/dev.controller';

const app = hono();

app.get('/dev', DevController.getStatus);
app.route('/auth', authRoute);
app.route('/documents', documentRoute);

export default app;
