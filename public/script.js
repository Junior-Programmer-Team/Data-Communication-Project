async function sendData() {
    const input_text = document.getElementById("inputTest").value;

    const response = await fetch('http://localhost:3000/input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text })
    });

    const data = await response.json();

    console.log(data)
}
async function sendFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    response = await fetch('http://localhost:3000/sendFile', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    console.log(data);
}

//Message Section
const socket = io();
const ChatBox = document.getElementById("ChatBox")

async function SendMessage() {
    const Message = document.getElementById("Message")
    
    
    if (Message.value !== ""){
        socket.emit('chat-message', Message.value); //send to handler
        Message.value=''
    }
}


// Receiving data from the server
socket.on('new-message', (data) => {//handler
    let chatContent = document.createElement('p');
    chatContent.textContent = data;
    ChatBox.appendChild(chatContent)
});