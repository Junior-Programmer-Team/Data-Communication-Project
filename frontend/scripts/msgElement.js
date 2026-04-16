import { chatHistory } from "../main.js";

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

// ....
function wrapWithOtherChatClass(html) {
    return `
    <div class="other-chat">
        <img class="icon" src="Picture/Icon-User.png" alt="icon-user">
        ${html}
    </div>`;
}

export function createMessageElement(rawData, isSender = true) {
    // const { id, username, msg_type, data, created_at } = rawData;
    const { id, msg_type, data, created_at } = rawData;

    const messageClass = isSender ? 'user-message' : 'other-message';
    const bubbleClass = isSender ? 'user-bubble' : 'other-bubble';
    const imageClass = isSender ? 'user-image' : 'other-image';
    const fileClass = isSender ? 'user-file' : 'other-file';


    const time = convertTimeToHHMM(created_at);
    let msgHTML;

    // For Text na kub
    if (msg_type === "text") {
        
        msgHTML = `
            <div class="${messageClass}" isSender="${isSender}">
                <p class="time">${time}</p>
                <p class="${bubbleClass}">${data.text}</p>
            </div>
        `;

        if (!isSender) {
            msgHTML = wrapWithOtherChatClass(msgHTML);
        }

        chatHistory.insertAdjacentHTML('beforeend', msgHTML);
    // For Files na kub
    } else {        
        const { filename, filetype, url } = data;
        const downloadId = `download-${id}`;

        // if File is image >> Preview Image in HTML
        if (filetype.startsWith('image/')) {
            msgHTML = `
                <div class="${imageClass}" isSender="${isSender}">
                    <p class="time">${time}</p>
                    <button id="${downloadId}" class="image-btn-download"><img class="image-preview" src="${url}" alt="${filename}"></button>
                </div>
            `;
        } else {
            msgHTML = `
                <div class="${fileClass}" isSender="${isSender}">
                    <p class="time">${time}</p>
                    <button id="${downloadId}" class="${bubbleClass} file" >📁 ${filename}</button>
                </div>
            `;
        }

        if (!isSender) {
            msgHTML = wrapWithOtherChatClass(msgHTML);
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