import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerUser } from '../controllers/auth/register.user';
import {
	loginSchema,
	registerSchema,
	verifyOtpSchema,
} from '../schemas/auth.schema';
import { verifyUser } from '../controllers/auth/verify.user';
import { loginUser } from '../controllers/auth/login.user';

const auth = new Hono();

auth.post('/register', zValidator('json', registerSchema), registerUser);

auth.post('/verify/:id', zValidator('json', verifyOtpSchema), verifyUser);

auth.post('/login', zValidator('json', loginSchema), loginUser);

export default auth;
