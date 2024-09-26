import { Schema, model } from 'mongoose';
const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
		},
		username: {
			type: String,
			required: false,
			unique: true,
		},
		mobile: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const User = model('User', userSchema);

export default User;
