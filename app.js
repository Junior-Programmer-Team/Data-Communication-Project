require('dotenv').config(); // for environment || .env
const express = require('express');
const app = express();
const db = require("./db"); // for database
const multer = require('multer');
const cors = require('cors');

const { uploadFile } = require("./upload");
const { insertIntoDB } = require("./db_service");

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// const storage = multer.diskStorage({
//     destination: (req,file,cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req,file,cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });


// ---- Send File Function ---- //
// app.post('/sendFile', upload.single('file'), (req, res) => {
//     console.log("===================================");
//     try {
//         if (!req.file) {
//                 return res.status(400).json({ message: 'กรุณาเลือกไฟล์' });
//             }
//             console.log('ข้อมูลไฟล์:', req.file);
    
//             res.json({
//                 message: 'อัปโหลดสำเร็จ!',
//                 fileDetail: req.file
//             });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/sendFile', upload.single('file'), async (req, res) => {
    console.log("===================================");
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'กรุณาเลือกไฟล์' });
        }
        console.log('ข้อมูลไฟล์:', req.file);
        const originalName = req.file.originalname;

        // Upload to R2
        const fileUrl = await uploadFile(
            req.file.buffer,
            "DataCommu", 
            Date.now() + "-" + req.file.originalname,
            req.file.mimetype
        );

        // Commit into Database
        const result = await insertIntoDB(
            req.file.originalname,
            req.file.fieldname,
            {   url: fileUrl,
                filename: req.file.originalname
             }
        );

        console.log({ 
            status: "Success!", 
            filename: originalName, 
            url: fileUrl ,
            savedToDB: result.rows[0]
        })

        res.json({ 
            filename: originalName, 
            url: fileUrl,
            savedMessage: result.rows[0]
        });

    } catch (error) {
        console.error("สาเหตุที่ Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// Get Normal (Text) from Frontend
// app.post('/message', async (req, res) => {
//     try {
//         const { username, mas_type, data } = req.body;

//         const result = await insertIntoDB(
//             "User",
//             mas_type,
//             data,
//         ); 

//         console.log({ Status: "Success!", savedMessage: result.rows[0]});

//     } catch (Error) {
//         console.error("Error saving message:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
 
  console.log('Log in')
  // 1. Listening for a message from a specific client
  socket.on('chat-message', (data) => {
    console.log(`User ${socket.id} sent: ${data}`);

    // 3. Sending back to EVERYONE including the sender
    console.log("Message sended")
    io.emit('new-message', data);
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));