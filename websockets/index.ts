Bun.serve({
	fetch(req, server) {
		// upgrade the request to a WebSocket
		if (server.upgrade(req)) {
			console.log('Upgrading');
			console.log(req);
			return; // do not return a Response
		}
		return new Response('Upgrade failed', { status: 500 });
	},
	websocket: {
		message(ws, message) {
			console.log('message', message);
			ws.send(message);
		}, // a message is received
		open(ws) {
			console.log('remoteAddress:', ws.remoteAddress);
		}, // a socket is opened
		close(ws, code, message) {}, // a socket is closed
		drain(ws) {}, // the socket is ready to receive more data
	}, // handlers
	port: 5050,
});
