require('dotenv').config(); // for environment || .env

const express = require('express');
const app = express();

const db = require("./db"); // for database


app.use(express.json());
app.use(express.static('public'));

app.post('/input', (req, res) => {
    console.log(req.body);
    res.json({
        message: "Recived!",
        data: req.body,
    });
});

// app.post("/message", async (req, res) => {
//     try {
//         const { username, msg_type, data } = req.body;

//         const result = await db.query(
//             "INSERT INTO messages (username ,msg_type, data) VALUES ($1, $2, $3) RETURNING *",
//             [username || "anon", msg_type, data]
//         );

//         res.json(result.rows[0]);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "DB error" });
//     }
// });

//


// app.get("/messages", async (req, res) => {
//     try {
//         const result = await db.query(
//             "SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"
//         );
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).json({ error: "Cannot fetch messages" });
//     }
// });


// (async () => {

// })();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});