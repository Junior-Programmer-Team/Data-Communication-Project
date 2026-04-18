const { getAllMessages } = require("./db_service.js");

function createSocketServer(server) {
	const { Server: SocketServer } = require("socket.io");
	const thisServer = new SocketServer(server, {
		cors: {
			origin: "*",
		}
	});

	thisServer.on('connection', async (socket) => {
		console.log("Connected:", socket.id);

		console.log(await getAllMessages());

		// send all message to the client
		socket.emit("message-from-server", await getAllMessages());

		// someone send a message
		socket.on('message-from-client', (data) => {
			thisServer.emit('message-from-server', [data]);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected:", socket.id);
		});
	});
}
		
module.exports = { createSocketServer };