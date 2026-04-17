import { socketSendMessage } from "./scripts/socket.js";
import { init, getUsername } from "./scripts/username.js";

export const chatHistory = document.getElementById("chat-history");
const sendBtn = document.getElementById("btn-sendchat");
const fileBtn = document.getElementById("btn-sendfile");
const chatDateTime = document.getElementById("chat-date-time");
const msgInput = document.getElementById("input-typing");

export const enterNamePopup = document.getElementById("enter-name-popup");
export const enterNameInput = document.getElementById("enter-name-input");
export const enterNameSubmitBtn = document.getElementById("enter-name-submit-btn");

// ------------------------------------------------
// Initial Setup
// ------------------------------------------------
init();


// อัปเดตวันที่ด้านบน
const today = new Date();
chatDateTime.innerText = today.toLocaleDateString('en-GB', {
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
                username: getUsername(),
                mas_type: "text", 
                data: { text: text } 
            })
        });
        console.log("บันทึกข้อความลง DB สำเร็จ!");
    } catch (err) {
        console.error("ส่งข้อความไม่สำเร็จ:", err);
    }

    const data = await response.json();
    socketSendMessage(data)
    
    msgInput.value = ""; // เคลียร์ช่องพิมพ์

}

// ----------------------------------------------------
// Upload File (Image/others file) through Cloud & DB
// ----------------------------------------------------
fileInput.addEventListener("change", async function() {
    const file = this.files[0];
    if (!file) return;

    // Send to Backend > Cloudflare R2 > Save into DB
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', getUsername());

    try {
        const response = await fetch('/sendFile', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        socketSendMessage(data)
        
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