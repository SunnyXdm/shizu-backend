const sendOtp = async (otp: string, user: any) => {
	console.log('OTP:', otp, JSON.stringify(user, null, 2));
};

export default sendOtp;
