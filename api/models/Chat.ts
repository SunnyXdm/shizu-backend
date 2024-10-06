import { Schema, model } from 'mongoose';
import type { ObjectId } from 'mongoose';
import User from './User';

const chatSchema = new Schema(
	{
		title: { type: String },
		username: { type: String },
		type: {
			type: String,
			enum: ['private', 'group'],
			required: true,
		},
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{
		timestamps: true,
		methods: {
			getChatTitle: async function (userId: ObjectId | undefined) {
				if (this.type !== 'private' || !userId) return this.title;

				const chatUser = this.users.find(
					(u: any) => u.toString() !== userId.toString()
				);

				if (!chatUser) return this.title;
				const user = await User.findById(chatUser);
				if (!user) return this.title;
				return user.getFullName();
			},
		},
	}
);

const Chat = model('Chat', chatSchema);
export default Chat;
