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
function generateMessageHTML(username, contentHTML, time, isSender) {
    const profileIconHTML = isSender ? '' : `<img id="other-icon" src="Picture/Icon-User.png" alt="icon-user">`;
    const usernameHTML = !isSender ? `<span id="text-username">${username}</span>` : '';

    return `
    <div class="other-message message-container" is-sender="${isSender}">
        ${profileIconHTML}

        <div class="message-content">
            ${usernameHTML}
            ${contentHTML}
        </div>
        
        <div class="time">${time}</div>
    </div>`;
}

export function createMessageElement(rawData, isSender = true) {
    // const { id, username, msg_type, data, created_at } = rawData;
    const { id, username, msg_type, data, created_at } = rawData;

    const time = convertTimeToHHMM(created_at);
    let msgHTML;

    if (msg_type === "text") {
        // For Text na kub
        msgHTML = `<p class="message-bubble">${data.text}</p>`;
    } else {        
        // For Files na kub
        const { filename, filetype, url } = data;
        const downloadId = `download-${id}`;

        // if File is image >> Preview Image in HTML
        if (filetype.startsWith('image/')) {
            msgHTML = `<button id="${downloadId}" class="image-btn-download"><img class="image-preview" src="${url}" alt="${filename}"></button>`;
        } else {
            msgHTML = `<button id="${downloadId}" class="message-bubble file" >📁 ${filename}</button>`;
        }

        setTimeout(() => {
            const downloadButtonElement = document.querySelector(`#${downloadId}`);
            if (downloadButtonElement) {
                downloadButtonElement.addEventListener('click', () => {
                    window.open(url, '_blank');
                });
            }
        }, 1);
    }

    msgHTML = generateMessageHTML(username, msgHTML, time, isSender);
    chatHistory.insertAdjacentHTML('beforeend', msgHTML);

    scrollToBottom();
}