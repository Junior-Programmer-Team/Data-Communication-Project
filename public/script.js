import { createMessageElement } from "./scripts/msgElement.js";

export const chatHistory = document.getElementById("chat-history");


// document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("btn-sendchat");
    const fileBtn = document.getElementById("btn-sendfile");
    const dateArea = document.getElementById("date-time");
    const msgInput = document.getElementById("type-msg");
    
    // อัปเดตวันที่ด้านบน
    const today = new Date();
    dateArea.innerText = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Input สำหรับการเลือกไฟล์
    const fileInput = document.createElement("input");
    fileInput.type = "file";


    // ----------------------------------------------------
    // Text Message Handler Show output and store in database
    // ----------------------------------------------------
    
    async function sendTextMessage() {
        const text = msgInput.value;
        if (!text) return; // ถ้าไม่ได้พิมพ์อะไรให้หยุดทำงาน
        let response;

        // Send data to Backend
        try {
            response = await fetch('/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: "User1", // Userrrrrrrrrrrr
                    mas_type: "text", 
                    data: { text: text } 
                })
            });
            console.log("บันทึกข้อความลง DB สำเร็จ!");
        } catch (err) {
            console.error("ส่งข้อความไม่สำเร็จ:", err);
        }

        const data = await response.json();

        createMessageElement(data)
        msgInput.value = ""; // เคลียร์ช่องพิมพ์

    }

    // Receiving data from the server
    socket.on('new-message', (data) => { //handler
        const time = getCurrentTime();

        const msgHTML = `
            <div class="other-chat">
                <img class="icon" src="Picture/Icon-User.png" alt="icon-user">
                <div class="other-message">
                <p class="user-bubble">${data}</p>
                <p class="time">${time}</p>
                </div>
            </div>
        `;

        chatHistory.insertAdjacentHTML('beforeend', msgHTML);
        scrollToBottom();
    });
    
    

    // ----------------------------------------------------
    // Upload File (Image/others file) through Cloud & DB
    // ----------------------------------------------------
    fileInput.addEventListener("change", async function() {
        const file = this.files[0];
        if (!file) return;

        // const time = getCurrentTime();
        // let msgHTML = '';
        // const messageId = "msg-" + Date.now();
        // // if File is image >> Preview Image in HTML
        // if (file.type.startsWith('image/')) {
        //     const imgURL = URL.createObjectURL(file);
        //     msgHTML = `
        //         <div class="send-file" id="user-send-img">
        //             <p class="time">${time}</p>
        //             <button><img class="send-img" src="${imgURL}" alt="send picture"></button>
        //         </div>
        //     `;
        // } else {
        //     msgHTML = `
        //         <div class="send-file">
        //             <p class="time">${time}</p>
        //             <button class="user-bubble" id="file">📁 ${file.name}</button>
        //         </div>
        //     `;
        // }
        // chatHistory.insertAdjacentHTML('beforeend', msgHTML);
        // scrollToBottom();


        // Send to Backend > Cloudflare R2 > Save into DB
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/sendFile', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();

            createMessageElement(data)
            this.value = ''; // Reset input file

            console.log("บันทึกไฟล์สำเร็จ!", data);

            

        } catch (err) {
            console.error("อัปโหลดไม่สำเร็จ:", err);
        }
    });

    // ----------------------------------------------------
    // Event Listeners (ผูกปุ่มกับการทำงาน)
    // ----------------------------------------------------
    
    // กดปุ่มส่งข้อความ (ไอคอนเครื่องบินกระดาษ)
    
    sendBtn.addEventListener("click", sendTextMessage);
    
    // กดปุ่ม Enter บนคีย์บอร์ดเพื่อส่งข้อความ
    msgInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendTextMessage();
        }
    });

    // กดปุ่มแนบไฟล์ ให้จำลองการกด input type="file"
    fileBtn.addEventListener("click", () => {
        fileInput.click();
    });

// });


//Message Section
// const socket = io();
// const ChatBox = document.getElementById("ChatBox")

// async function SendMessage() {
//     const Message = document.getElementById("Message")
    
    
//     if (Message.value !== ""){
//         socket.emit('chat-message', Message.value); //send to handler
//         Message.value=''
//     }
// }

// // Receiving data from the server
// socket.on('new-message', (data) => { //handler
//     let chatContent = document.createElement('p');
//     chatContent.textContent = data;
//     ChatBox.appendChild(chatContent)
// });