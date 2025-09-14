import { DocumentsController } from "@/controller";
import { hono } from "@/lib/hono";
import { authMiddleware } from "@/middleware/auth.middleware";

const app = hono();

app.use(authMiddleware);

app.put('/upload', DocumentsController.upload);
app.get('/all', DocumentsController.getDocuments);


export default app;