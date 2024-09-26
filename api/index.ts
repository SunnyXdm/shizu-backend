import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { connect } from 'mongoose';
import user from './src/user';

await connect(
	process.env.MONGO_URI || 'mongodb://localhost:27017/hono',
	{}
).then(() => {
	console.log('Connected to MongoDB');
});

const app = new Hono();
app.use('*', logger());

app.notFound((c) => {
	return c.text('NOT FOUND', 404);
});

app.route('/user', user);

showRoutes(app);

Bun.serve({
	fetch: app.fetch,
	port: 4000,
});
