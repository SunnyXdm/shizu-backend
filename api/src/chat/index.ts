import { Hono } from 'hono';
import Chat from '../../models/Chat';
import User from '../../models/User';

const chat = new Hono();

chat.post('/', async ({ json, req, get }) => {
	try {
		const user = get('jwtPayload');
		const body = await req.json();
		const { title, username, type, users } = body;
		console.log('chat', body);

		if (!title || !username || !type || !users) {
			return json({ status: 'error', message: 'INVALID_INPUTS' }, 400);
		}

		if (users.length === 0) {
			return json({ status: 'error', message: 'NO_USERS' }, 400);
		} else {
			const usersExist = await User.find({
				_id: { $in: users },
				isVerified: true,
			});

			if (usersExist.length !== users.length) {
				return json(
					{ status: 'error', message: 'USERS_NOT_FOUND' },
					404
				);
			}

			if (!users.includes(user.id)) {
				return json(
					{ status: 'error', message: 'CREATOR_NOT_IN_USERS' },
					400
				);
			}
		}

		// check if chat already exists with username
		const chatExist = await Chat.findOne({
			username,
		});

		if (chatExist) {
			return json(
				{ status: 'error', message: 'CHAT_USERNAME_ALREADY_EXISTS' },
				400
			);
		}

		const chat = await Chat.create({
			title,
			username,
			type,
			users,
		});

		return json(
			{
				status: 'success',
				data: {
					chat,
				},
				message: 'chat_CREATED_SUCCESSFULLY',
			},
			201
		);
	} catch (error) {
		console.log(error);
	}
});

chat.get('/', async ({ json, get }) => {
	try {
		const user = get('jwtPayload');
		const chats = await Chat.find({
			users: { $in: [user.id] },
		});
		return json({ status: 'success', data: { chats } });
	} catch (error) {
		console.log(error);
	}
});

chat.get('/:id', async ({ json, req, get }) => {
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

		return json({ status: 'success', data: { chat } });
	} catch (error) {
		console.log(error);
	}
});

export default chat;
