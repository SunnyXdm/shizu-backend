import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
	{
		from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
		type: { type: String, required: true },
		text: { type: String, required: true },
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true, // Include virtual fields
			transform: (doc, ret) => {
				console.log(ret, doc);
				ret.id = ret._id; // Map _id to id
				delete ret._id; // Remove _id
				delete ret.__v; // Optionally remove __v if you don't need versioning
			},
		},
		toObject: { virtuals: true },
	}
);

const Message = model('Message', messageSchema);

export default Message;
