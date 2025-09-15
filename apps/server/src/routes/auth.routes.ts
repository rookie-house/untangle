import { hono } from '@/lib/hono';
import { AuthController } from '@/controller';
import { authValidator } from '@/lib/validator/auth.validator';

const app = hono();

app.post('/signup', authValidator, AuthController.signup);
app.post('/signin', authValidator, AuthController.signin);
app.get('/google', AuthController.google);
app.get('/google/callback', AuthController.googleCallback);

export default app;
