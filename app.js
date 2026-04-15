require('dotenv').config(); // for environment || .env
const express = require('express');
const app = express();
const db = require("./db"); // for database

app.use(express.json());
app.use(express.static('public'));

// 1) get messages from db
app.get("/messages", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM messages ORDER BY created_at ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
    }
});

// 2) send message into db
app.post("/message", async (req, res) => {
    try {
        const { username, msg_type, data } = req.body;
        const result = await db.query(
            "INSERT INTO messages (username, msg_type, data) VALUES ($1, $2, $3) RETURNING *",
            [username || "anon", msg_type, data]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "บันทึกล้มเหลว" });
    }
});

// 3) delete message
app.delete("/message/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM messages WHERE id = $1", [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "ลบล้มเหลว" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));