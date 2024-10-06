import { Schema, model } from 'mongoose';
interface User extends Document {
	firstName: string;
	lastName?: string;
	username?: string;
	mobile: string;
	password: string;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	// methods
	getFullName(): string;
}
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
	{
		timestamps: true,
		methods: {
			getFullName: function () {
				if (!this.lastName) return this.firstName;
				return `${this.firstName} ${this.lastName}`;
			},
		},
	}
);

const userModel = model<User>('User', userSchema);

export default userModel;
