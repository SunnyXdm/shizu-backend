interface USER {
	id: string;
	username: string;
	mobile: string;
	firstName: string;
	lastName: string;
	createdAt: string;
}

interface USER_LOGIN {
	mobile: string;
	username: string;
	password: string;
}

interface USER_REGISTER {
	firstName: string;
	lastName: string;
	username: string;
	mobile: string;
	password: string;
}

interface USER_OTP {
	mobile: string;
	otp: string;
}

interface USER_VERIFY {
	otp: string;
}

interface USER_VERIFY_RESPONSE {
	accessToken: string;
}
