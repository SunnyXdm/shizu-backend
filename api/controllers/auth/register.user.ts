import type { Context } from 'hono';
import { createHash } from '../../utils/hash';
import User from '../../models/User';
import Otp from '../../models/Otp';
import sendOtp from '../../utils/otp';

export async function registerUser({ json, req }: Context) {
	try {
		const body = await req.json();
		const { firstName, lastName, username, password, mobile } = body;

		// check if user exists
		const user = await User.findOne({
			$or: [{ username }, { mobile }],
		});

		if (user) {
			return json({ status: 'error', message: 'USER_EXISTS' }, 409);
		}
		// create user
		const newUser = await User.create({
			firstName,
			lastName,
			username,
			mobile,
			password: await createHash(password),
		});

		// generate otp
		const otp = '1234';
		const otpHash = await createHash(otp);
		await Otp.create({
			otp: otpHash,
			userId: newUser._id,
		});
		await sendOtp(otp, newUser.toJSON());

		return json(
			{
				status: 'success',
				data: {
					user: {
						id: newUser._id,
						firstName: newUser.firstName,
						lastName: newUser.lastName,
						username: newUser.username,
						createdAt: newUser.createdAt,
					},
				},
				message: 'USER_REGISTERED_SUCCESSFULLY',
			},
			201
		);
	} catch (error) {
		console.log(error);
	}
}
