import { hono } from '@/lib/hono';
import { AuthController } from '@/controller';
import { authValidator, phoneValidator } from '@/lib/validator/auth.validator';
import { authMiddleware } from '@/middleware/auth.middleware';

const app = hono();

app.post('/signup', authValidator, AuthController.signup);
app.post('/signin', authValidator, AuthController.signin);
app.get('/google', AuthController.google);
app.get('/google/callback', AuthController.googleCallback);
app.post('/whatsapp/start', phoneValidator, AuthController.getAuthLink);

app.get('/ping', authMiddleware, AuthController.ping);

export default app;
