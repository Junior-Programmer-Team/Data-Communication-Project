import { chatHistory } from "../script.js";

// ฟังก์ชันดึงเวลาปัจจุบัน (HH:MM)
function convertTimeToHHMM(dateString) {
    return new Date(dateString).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ฟังก์ชันเลื่อนหน้าจอแชทลงมาล่างสุด
function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

export function createMessageElement(rawData, isSender = true) {
    // const { id, username, msg_type, data, created_at } = rawData;
    const { id, msg_type, data, created_at } = rawData;

    const time = convertTimeToHHMM(created_at);
    let msgHTML;



    // For Text na kub
    if (msg_type === "text") {
        
        msgHTML = `
            <div class="user-message" isSender="${isSender}">
                <p class="time">${time}</p>
                <p class="user-bubble">${data.text}</p>
            </div>
        `;

        chatHistory.insertAdjacentHTML('beforeend', msgHTML);
    // For Files na kub
    } else {        
        const { filename, filetype, url } = data;
        const downloadId = `download-${id}`;

        // if File is image >> Preview Image in HTML
        if (filetype.startsWith('image/')) {
            msgHTML = `
                <div class="send-file" id="user-send-img" isSender="${isSender}">
                    <p class="time">${time}</p>
                    <button id="${downloadId}" class="img-sendFile"><img class="send-img" src="${url}" alt="send picture"></button>
                </div>
            `;
        } else {
            msgHTML = `
                <div class="send-file" isSender="${isSender}">
                    <p class="time">${time}</p>
                    <button id="${downloadId}" class="user-bubble file" >📁 ${filename}</button>
                </div>
            `;
        }

        chatHistory.insertAdjacentHTML('beforeend', msgHTML);

        const downloadButtonElement = document.querySelector(`#${downloadId}`);
        if (downloadButtonElement) { 
            downloadButtonElement.addEventListener('click', () => {
                window.open(url, '_blank');
            });
        }
    }

    scrollToBottom();
}