// ดึงข้อมูลมาโชว์ตอนโหลดหน้าเว็บ
window.onload = loadMessages;

async function loadMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = "msg";
        div.innerHTML = `
            <b>${msg.username}:</b> ${msg.data.text}
            <span class="delete-btn" onclick="deleteMsg(${msg.id})">x</span>
        `;
        chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // เลื่อนลงล่างสุด
}

async function sendData() {
    const user = document.getElementById("username");
    const input = document.getElementById("inputTest");
    
    if (!input.value) return;

    await fetch('/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: user.value || "anon", 
            msg_type: "text", 
            data: { text: input.value } 
        })
    });

    input.value = "";
    loadMessages();
}

async function deleteMsg(id) {
    if (!confirm("ลบข้อความนี้ใช่ไหม?")) return;
    await fetch(`/message/${id}`, { method: 'DELETE' });
    loadMessages();
}