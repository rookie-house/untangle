import { hono } from "@/lib/hono";
import { DocumentsController } from "@/controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const app = hono();

app.use(authMiddleware);

app.put('/upload', DocumentsController.upload);
app.get('/all', DocumentsController.getDocuments);
app.get('/:id', DocumentsController.getDocumentById);
app.get('/session/:sessionId', DocumentsController.getDocumentsBySession);


export default app;