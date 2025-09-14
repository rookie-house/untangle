import { hono } from '@/lib/hono';
import authRoutes from './auth.routes';
import documentRoutes from './documents.routes';
import agentRoutes from './untangle-adk.routes';
import { DevController } from '@/controller/dev.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const app = hono();

app.get('/dev', DevController.getStatus);
app.route('/auth', authRoutes);

app.use(authMiddleware);

app.route('/documents', documentRoutes);
app.route('/agents', agentRoutes);

export default app;
