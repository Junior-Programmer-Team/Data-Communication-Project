const express = require('express');
const app = express();
const multer = require('multer');
// const db = require("./db");
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/input', (req, res) => {
  console.log(req.body);
  res.json({
    message: "Recived!",
    data: req.body,
  });
});

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'uploads/');
  },
    filename: (req,file,cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });
  
  app.post('/sendFile', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'กรุณาเลือกไฟล์' });
      }
      console.log('ข้อมูลไฟล์:', req.file);
      
      res.json({
        message: 'อัปโหลดสำเร็จ!',
        fileDetail: req.file
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
const io = require('socket.io')(3000, {
  cors: { origin: "*" } 
});

io.on('connection', (socket) => {
  // 1. Listening for a message from a specific client
  socket.on('chat-message', (data) => {
    console.log(`User ${socket.id} sent: ${data}`);

    // 3. Sending back to EVERYONE including the sender
    io.emit('new-message', data);
  });
});
  


  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  