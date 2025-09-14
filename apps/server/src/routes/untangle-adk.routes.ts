import { UntangleADKController } from '@/controller/untangle-adk.controller';
import { hono } from '@/lib/hono';
import { firstChatValidator } from '@/lib/validator/agent.validator';

const app = hono();

app.get('/sessions', UntangleADKController.getSessions);
app.post('/sessions', firstChatValidator, UntangleADKController.starts);
app.post('/create-sessions', UntangleADKController.createSession);
app.delete('/sessions/:id', UntangleADKController.deleteSession);

export default app;
