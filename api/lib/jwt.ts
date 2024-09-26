import { sign } from 'hono/jwt';

const SECRET = process.env.JWT_SECRET || 'secret';

const createJwt = async ({ id, username }: { id: any; username: any }) => {
	const payload = {
		username,
		id,
		exp: Math.floor(Date.now() / 1000) + 60 * 60,
		iat: Math.floor(Date.now() / 1000),
	};
	return sign(payload, SECRET, 'HS256');
};

export { createJwt };
