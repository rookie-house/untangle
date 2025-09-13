import { AuthController } from '@/controller/auth.controller';
import { hono } from '@/lib/hono';
import { authValidator } from '@/lib/validator/auth.validator';
import type { Context } from 'hono';

const app = hono();

app.post('/signup', authValidator, async (ctx: Context) => await AuthController.signup(ctx));
app.post('/signin', authValidator, async (ctx: Context) => await AuthController.signin(ctx));
app.get('/google', async (ctx: Context) => await AuthController.google(ctx));
app.get('/google/callback', async (ctx: Context) => await AuthController.googleCallback(ctx));

export default app;
