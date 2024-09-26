import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
	{
		from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
		type: { type: String, required: true },
		text: { type: String, required: true },
	},
	{ timestamps: true }
);

const Message = model('Message', messageSchema);

export default Message;
