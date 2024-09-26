import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { connect } from 'mongoose';
import user from './src/user';
import chat from './src/chat';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { JWT_SECRET, MONGO_URI } from './config';
import message from './src/message';

await connect(MONGO_URI, {}).then(() => {
	console.log('Connected to MongoDB');
});

type Variables = JwtVariables;
const app = new Hono<{ Variables: Variables }>();
app.use('*', logger());

app.notFound((c) => {
	return c.text('NOT FOUND', 404);
});

app.route('/user', user);

app.use('*', jwt({ secret: JWT_SECRET }));

app.route('/chat', chat);
app.route('/message', message);

showRoutes(app);

Bun.serve({
	fetch: app.fetch,
	port: 4000,
});
