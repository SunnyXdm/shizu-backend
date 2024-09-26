import { Hono } from 'hono';
import { createHash, verifyHash } from '../../lib/hash';
import User from '../../models/User';
import Otp from '../../models/Otp';
import { createJwt } from '../../lib/jwt';
import sendOtp from '../../lib/otp';

const user = new Hono();

user.post('/register', async ({ json, req }) => {
	try {
		const body = await req.json();
		const { firstName, lastName, username, password, mobile } = body;
		console.log('register', body);

		if (!firstName || !username || !password || !mobile) {
			return json({ status: 'error', message: 'INVALID_INPUTS' }, 400);
		}
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
});

user.post('/verify/:id', async ({ json, req }) => {
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
});

user.post('/login', async ({ json, req }) => {
	try {
		const body = await req.json();

		const { mobile, username, password } = body;

		const user = await User.findOne({
			$or: [{ mobile }, { username }],
		});

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
});

export default user;
