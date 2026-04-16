document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("btn-sendchat");
    const msgInput = document.getElementById("type-msg");
    const chatHistory = document.getElementById("chat-history");
    const fileBtn = document.getElementById("btn-sendfile");
    const dateArea = document.getElementById("date-time");

    // อัปเดตวันที่ด้านบน
    const today = new Date();
    dateArea.innerText = today.toLocaleDateString('th-TH', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // Input สำหรับการเลือกไฟล์
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    // ฟังก์ชันดึงเวลาปัจจุบัน (HH:MM)
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    }

    // ฟังก์ชันเลื่อนหน้าจอแชทลงมาล่างสุด
    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // ----------------------------------------------------
    // Send Text Message into Database
    // ----------------------------------------------------
    async function sendTextMessage() {
        const text = msgInput.value.trim();
        if (!text) return; // ถ้าไม่ได้พิมพ์อะไรให้หยุดทำงาน

        const time = getCurrentTime();
        
        // Output to html
        const msgHTML = `
            <div class="user-message" style="display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 10px;">
                <p class="user-bubble" style="background-color: #d1f4cc; padding: 10px; border-radius: 15px; margin: 0;">${text}</p>
                <p class="time" style="font-size: 10px; color: gray; margin: 2px 0 0 0;">${time}</p>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', msgHTML);
        msgInput.value = ""; // เคลียร์ช่องพิมพ์
        scrollToBottom();

        // Send data to Backend
        try {
            await fetch('/message', {
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
    }

    // ----------------------------------------------------
    // Upload File (Image/others file) through Cloud & DB
    // ----------------------------------------------------
    fileInput.addEventListener("change", async function() {
        const file = this.files[0];
        if (!file) return;

        const time = getCurrentTime();
        let msgHTML = '';

        const messageId = "msg-" + Date.now();

        // if File is image >> Preview Image in HTML
        if (file.type.startsWith('image/')) {
            const imgURL = URL.createObjectURL(file);
            msgHTML = `
                <div class="send-file" id="user-send-img" style="display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 10px;">
                    <img class="send-img" src="${imgURL}" alt="send picture" style="max-width: 200px; border-radius: 10px;">
                    <p class="time" style="font-size: 10px; color: gray; margin: 2px 0 0 0;">${time} (กำลังส่ง...)</p>
                </div>
            `;
        } else {
            msgHTML = `
                <div class="send-file" style="display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 10px;">
                    <button class="user-bubble" id="file" style="cursor: pointer; padding: 10px; border-radius: 15px;">📁 ${file.name}</button>
                    <p class="time" style="font-size: 10px; color: gray; margin: 2px 0 0 0;">${time} (กำลังส่ง...)</p>
                </div>
            `;
        }

        chatHistory.insertAdjacentHTML('beforeend', msgHTML);
        scrollToBottom();

        // Send to Backend > Cloudflare R2 > Save into DB
        const formData = new FormData();
        formData.append('file', file);
        this.value = ''; // Reset input file

        try {
            const response = await fetch('/sendFile', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            console.log("บันทึกไฟล์สำเร็จ!", data);
            
            // Delete Stage "(กำลังส่ง...)" after upload
            const sentMessageDiv = document.getElementById(messageId);
            if (sentMessageDiv) {
                const timeStatusElement = sentMessageDiv.querySelector('.time-status');
                timeStatusElement.innerText = time; // เปลี่ยนเป็นเหลือแค่เวลา (เช่น "15:05")
            }

        } catch (err) {
            console.error("อัปโหลดไม่สำเร็จ:", err);

            // ❌ ถ้าส่งไม่สำเร็จ แจ้งเตือนบน html ให้เห็น (จะได้ไม่ต้องดูจาก console อะนะ)
            const sentMessageDiv = document.getElementById(messageId);
            if (sentMessageDiv) {
                const timeStatusElement = sentMessageDiv.querySelector('.time-status');
                timeStatusElement.innerText = `${time} (ส่งไม่สำเร็จ ❌)`;
                timeStatusElement.style.color = "red";
            }
        }
    });

    // ----------------------------------------------------
    // Event Listeners (ผูกปุ่มกับการทำงาน)
    // ----------------------------------------------------
    
    // กดปุ่มส่งข้อความ (ไอคอนเครื่องบินกระดาษ)
    sendBtn.addEventListener("click", sendTextMessage);

    // กดปุ่ม Enter บนคีย์บอร์ดเพื่อส่งข้อความ
    msgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendTextMessage();
        }
    });

    // กดปุ่มแนบไฟล์ ให้จำลองการกด input type="file"
    fileBtn.addEventListener("click", () => {
        fileInput.click();
    });

});