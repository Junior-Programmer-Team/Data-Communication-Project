import { createMessageElement } from "./msgElement.js";
import { getUsername } from "./username.js";

// eslint-disable-next-line no-undef
const socket = io("/"); 

socket.on("message-from-server", (allMessages) => {
	for (const data of allMessages) {
		createMessageElement(data, data.username === getUsername());
	}
});

export function socketSendMessage(data) {
	socket.emit("message-from-client", data);
}
