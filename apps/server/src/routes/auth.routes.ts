import { AuthController } from '@/controller';
import { hono } from '@/lib/hono';
import { authValidator } from '@/lib/validator/auth.validator';
import type { Context } from 'hono';

const app = hono();

app.post('/signup', authValidator, AuthController.signup);
app.post('/signin', authValidator, AuthController.signin);
app.get('/google', AuthController.google);
app.get('/google/callback', AuthController.googleCallback);

export default app;
