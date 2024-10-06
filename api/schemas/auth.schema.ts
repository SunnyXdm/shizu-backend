import { z } from 'zod';

export const registerSchema = z.object({
	firstName: z.string().min(1, 'First name is required'), // non-empty check
	lastName: z.string().min(1).optional(),
	username: z.string().min(1, 'Username is required'), // non-empty check
	password: z.string().min(6, 'Password must be at least 6 characters'), // minimum length check
	mobile: z.string().min(1, 'Mobile number is required'), // non-empty check
});

export const verifyOtpSchema = z.object({
	otp: z.string().length(4, 'OTP must be 4 digits'), // Ensure OTP is exactly 4 characters long
});

// Schema for login validation
export const loginSchema = z
	.object({
		mobile: z.string().optional(), // `mobile` is optional but must be a string if provided
		username: z.string().optional(), // `username` is optional but must be a string if provided
		password: z.string().min(6, 'Password must be at least 6 characters'), // Enforce a minimum password length
	})
	.refine((data) => data.mobile || data.username, {
		message: 'Either mobile or username must be provided', // Ensure at least one is provided
		path: ['mobile', 'username'], // Affects both fields
	});
