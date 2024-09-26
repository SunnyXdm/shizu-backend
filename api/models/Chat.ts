import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
	{
		title: { type: String },
		username: { type: String },
		type: { type: String, required: true }, // private, group, supergroup, channel
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

const Chat = model('Chat', chatSchema);
export default Chat;