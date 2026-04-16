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

// Receiving data from the server
// socket.on('new-message', (data) => { //handler
//     const time = getCurrentTime();

//     const msgHTML = `
//         <div class="other-chat">
//             <img class="icon" src="Picture/Icon-User.png" alt="icon-user">
//             <div class="other-message">
//             <p class="user-bubble">${data}</p>
//             <p class="time">${time}</p>
//             </div>
//         </div>
//     `;

//     chatHistory.insertAdjacentHTML('beforeend', msgHTML);
//     scrollToBottom();
// });