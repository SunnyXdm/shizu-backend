import type { Context } from 'hono';
import { verifyHash } from '../../utils/hash';
import User from '../../models/User';
import { createJwt } from '../../utils/jwt';

export async function loginUser({ json, req }: Context) {
	try {
		const body = await req.json();

		const { mobile, username, password } = body;

		const user = await User.findOne({
			$or: [{ mobile }, { username }],
		});
		console.log('login', { body, user });

		if (!user) {
			return json({ status: 'error', message: 'USER_NOT_FOUND' }, 404);
		}

		if (!(await verifyHash(password, user.password))) {
			return json(
				{ status: 'error', message: 'INVALID_CREDENCITIALS' },
				401
			);
		}

		if (!user.isVerified) {
			return json({ status: 'error', message: 'USER_NOT_VERIFIED' }, 400);
		}

		const accessToken = await createJwt({
			id: user._id,
			username: user.username,
		});

		return json(
			{
				status: 'success',
				data: {
					user: {
						id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						username: user.username,
						mobile: user.mobile,
						createdAt: user.createdAt,
					},
					accessToken,
				},
				message: 'USER_LOGGED_IN_SUCCESSFULLY',
			},
			200
		);
	} catch (error) {
		console.log(error);
	}
}
