const express = require('express');
const app = express();

const db = require("./db");

app.use(express.json());
app.use(express.static('public'));

app.post('/input', (req, res) => {
    console.log(req.body);
    res.json({
        message: "Recived!",
        data: req.body,
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});