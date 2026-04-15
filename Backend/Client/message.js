const express = require('express');
const path = require('path');
const app = express();
const port = 4000;
// const API_KEY = 


message_Obj = {
        "type": message_type,
        "data": content,
    }

function SendMessage() {
    message_Obj
}

Dirname = "D:\\work\\my_work\\Second_year\\Second Semester\\Data Communication\\Project";

// Serve static files from the current directory
app.use(express.static(Dirname));

app.get('/login', (req, res) => {
  res.sendFile(path.join(Dirname, 'chat.html')); // Change 'home.html' to your filename
});

console.log(__dirname)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
