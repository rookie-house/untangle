import { hono } from '@/lib/hono';
import { DocumentsController } from '@/controller';

const app = hono();

app.put('/upload', DocumentsController.upload);
app.get('/all', DocumentsController.getDocuments);
app.get('/:id', DocumentsController.getDocumentById);
app.get('/session/:sessionId', DocumentsController.getDocumentsBySession);

export default app;
