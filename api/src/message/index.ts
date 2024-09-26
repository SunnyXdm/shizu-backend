import { Hono } from 'hono';
import User from '../../models/User';
import Message from '../../models/Message';
import Chat from '../../models/Chat';

const message = new Hono();

message.post('/:id', async ({ json, req, get }) => {
	try {
		const user = get('jwtPayload');
		const body = await req.json();
		const { chat, type, text } = body;

		if (!chat || !type || !text) {
			return json({ status: 'error', message: 'INVALID_INPUTS' }, 400);
		}

		if (type !== 'text') {
			return json(
				{ status: 'error', message: 'INVALID_MESSAGE_TYPE' },
				400
			);
		}

		const chatExist = await Chat.findOne({
			_id: chat,
			users: { $in: [user.id] },
		});

		if (!chatExist) {
			return json({ status: 'error', message: 'CHAT_NOT_FOUND' }, 404);
		}

		const message = await Message.create({
			from: user.id,
			chat,
			type: 'text',
			text,
		});

		return json(
			{
				status: 'success',
				data: {
					message: {
						id: message._id,
						from: message.from,
						chat: message.chat,
						type: message.type,
						text: message.text,
						createdAt: message.createdAt,
					},
				},
				message: 'MESSAGE_SENT_SUCCESSFULLY',
			},
			201
		);
	} catch (error) {
		console.log(error);
	}
});

message.get('/:id', async ({ json, req, get }) => {
	try {
		const user = get('jwtPayload');
		const id = req.param('id');
		const chat = await Chat.findOne({
			_id: id,
			users: { $in: [user.id] },
		});

		if (!chat) {
			return json({ status: 'error', message: 'CHAT_NOT_FOUND' }, 404);
		}
		const lastTimeStamp = Number(req.query('ts') ?? 0);
		const max = Number(req.query('ps') ?? 10);
		if (lastTimeStamp === 0 && max > 100) {
			return json({ status: 'error', message: 'INVALID_INPUTS' }, 400);
		}

		const messages = await Message.find({
			chat: chat._id,
			createdAt: { $gt: lastTimeStamp },
		})
			.sort({ createdAt: 1 })
			.limit(max);

		return json({ status: 'success', data: { messages } });
	} catch (error) {
		console.log(error);
	}
});

export default message;
