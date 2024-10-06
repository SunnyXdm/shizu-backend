import type { Context } from 'hono';
import User from '../../models/User';
import Otp from '../../models/Otp';
import { createHash, verifyHash } from '../../utils/hash';
import { createJwt } from '../../utils/jwt';

export async function verifyUser({ json, req }: Context) {
	try {
		const id = req.param('id');
		const { otp: userOtp } = await req.json();
		const user = await User.findById(id);

		if (!user) {
			return json({ status: 'error', message: 'USER_NOT_FOUND' }, 404);
		}

		if (user.isVerified) {
			return json(
				{ status: 'error', message: 'USER_ALREADY_VERIFIED' },
				400
			);
		}

		if (!userOtp && userOtp.length !== 4) {
			return json({ status: 'error', message: 'INVALID_OTP' }, 400);
		}

		const otpHash = await createHash(userOtp);
		const otp = await Otp.findOne({ userId: id });
		if (otp) {
			const isValid = await verifyHash(userOtp, otp.otp);
			if (!isValid) {
				return json({ status: 'error', message: 'INVALID_OTP' }, 400);
			}

			user.isVerified = true;
			await user.save();
			const accessToken = await createJwt({
				id: user._id,
				username: user.username,
			});

			return json(
				{
					status: 'success',
					message: 'EMAIL_VERIFIED',
					data: {
						accessToken,
					},
				},
				200
			);
		} else {
			return json({ status: 'error', message: 'INVALID_OTP' }, 400);
		}
	} catch (error) {
		console.log(error);
	}
}
