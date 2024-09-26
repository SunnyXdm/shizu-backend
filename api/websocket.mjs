import http from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import url from 'url';

const port = 8080;
const server = http.createServer();
const ws = new WebSocketServer({ server });

const c ={
  id: 20,
  message: "I don't know if I can do this anymore, Mr. White.",
  from: {
    id: 2,
    name: 'Jesse Pinkman',
    image:
      'https://i.pinimg.com/564x/a1/ab/f3/a1abf323da1397097d4622e0723848d0.jpg',
  },
  chat: {
    id: 1,
    name: 'Walter White',
    image:
      'https://i.pinimg.com/564x/e9/1a/74/e91a747bef4ff140ea5a01474b9fa699.jpg',
  },
  date: 1700019000000,
  type: 'text',
  text: "I don't know if I can do this anymore, Mr. White.",
}
const message = {
  date: Date, // required
  from: {
    // required
    id: 'user-id',
    is_bot: false,
    first_name: 'first-name',
    last_name: 'last-name',
    username: '@username',
  },
  chat: {
    // required
    id: 'chat-id',
    first_name: 'first-name',
    last_name: 'last-name',
    username: '@username',
    type: 'private' || 'group' || 'supergroup' || 'channel',
  },
  type: 'text' || 'sticker' || 'photo' || 'document', // text | sticker | image | document
  text: 'Hello World', // required if type is text
  sticker: {
    // required if type is sticker
    width: 512,
    height: 512,
    emoji: '😮',
    set_name: 'Moteharrek_glgli2',
    is_animated: true,
    is_video: false,
    type: 'regular',
    thumbnail: {
      file_id:
        'AAMCAQADGQEAARky4mYJYoTLKe3NHXH0JV73DEXuT-IEAAKMAgACUSkNORt0alSLBgimAQAHbQADNAQ',
      file_unique_id: 'AQADjAIAAlEpDTly',
      file_size: 5640,
      width: 128,
      height: 128,
    },
    thumb: {
      file_id:
        'AAMCAQADGQEAARky4mYJYoTLKe3NHXH0JV73DEXuT-IEAAKMAgACUSkNORt0alSLBgimAQAHbQADNAQ',
      file_unique_id: 'AQADjAIAAlEpDTly',
      file_size: 5640,
      width: 128,
      height: 128,
    },
    file_id:
      'CAACAgEAAxkBAAEZMuJmCWKEyyntzR1x9CVe9wxF7k_iBAACjAIAAlEpDTkbdGpUiwYIpjQE',
    file_unique_id: 'AgADjAIAAlEpDTk',
    file_size: 48771,
  },
  photo: [
    // required if type is photo
    {
      file_id:
        'AgACAgUAAx0CU0RPswACHuZmHh-9S6N0WGtOYgR7gxSoZOV2CgACE7kxG2f68VQ6HChfN9q2TwEAAwIAA3MAAzQE',
      file_unique_id: 'AQADE7kxG2f68VR4',
      file_size: 941,
      width: 90,
      height: 56,
    },
  ],
  document: {
    // required if type is document
    file_name: 'Screenshot 2024-04-16 at 12.18.21 PM.png',
    mime_type: 'image/png',
    thumbnail: {
      file_id:
        'AAMCBQADHQJTRE-zAAIe5GYeHzzXObBGZHlbd11AzlS3aQ3LAAL4DQACZ_rxVJf9PtIVtFyxAQAHbQADNAQ',
      file_unique_id: 'AQAD-A0AAmf68VRy',
      file_size: 1717,
      width: 320,
      height: 104,
    },
    thumb: {
      file_id:
        'AAMCBQADHQJTRE-zAAIe5GYeHzzXObBGZHlbd11AzlS3aQ3LAAL4DQACZ_rxVJf9PtIVtFyxAQAHbQADNAQ',
      file_unique_id: 'AQAD-A0AAmf68VRy',
      file_size: 1717,
      width: 320,
      height: 104,
    },
    file_id:
      'BQACAgUAAx0CU0RPswACHuRmHh881zmwRmR5W3ddQM5Ut2kNywAC-A0AAmf68VSX_T7SFbRcsTQE',
    file_unique_id: 'AgAD-A0AAmf68VQ',
    file_size: 9547,
  },
};

const connections = {};
const users = {};

const broadcast = (message) => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    connection.send(JSON.stringify(message));
  });
};

const broadcastMessage = (message) => {
  connections[message.chat.id].send(
    JSON.stringify({ ...message, date: new Date().getTime() })
  );
};

const handleMessage = (bytes, uuid) => {
  try {
    const json = JSON.parse(bytes.toString());
    const message = {
      from: users[uuid],
      chat: {
        ...users[json.chat_id],
        id: json.chat_id,
        type: 'private',
      },
      type: 'text',
      text: json.text,
    };
    broadcastMessage(message);
    return;
    console.log('Received message', { message });
    broadcast({ message });
  } catch (e) {
    console.log(e);
  }
};

ws.on('connection', (connection, request) => {
  try {
    console.log('New connection', request.url);
    const obj = url.parse(request.url, true).query
    console.log(obj);
    const ip = request.socket.remoteAddress;
    const uuid = uuidv4();
    connection.clientId = uuid;
    console.log('New connection from ' + ip, { uuid });
    console.log();
    ws.clients.forEach((client) =>
      console.log(ws.clients.size, client.clientId)
    );
    connections[uuid] = connection;
    users[uuid] = { ip };

    // broadcast to all clients
    connection.on('message', (bytes) => {
      handleMessage(bytes, uuid);
    });
  } catch (e) {
    console.log(e);
  }
});

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});
