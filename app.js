require('dotenv').config(); // for environment || .env
const express = require('express');
const app = express();
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

const upload = multer();

app.post('/sendFile', upload.single('file'), async (req, res) => {
    console.log("===================================");
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'กรุณาเลือกไฟล์' });
        }
        console.log('ข้อมูลไฟล์:', req.file);
        const originalName = req.file.originalname;
        const msgType = req.file.fieldname;
        const fileType = req.file.mimetype;

        // Upload to R2
        const fileUrl = await uploadFile(
            req.file.buffer,
            "DataCommu", 
            Date.now() + "-" + originalName,
            fileType
        );

        // Commit into Database
        const result = await insertIntoDB(
            originalName,
            msgType,
            {   
                filename: originalName,
                filetype: fileType,
                url: fileUrl,
             }
        );

        console.log({ 
            status: "Success!", 
            filename: originalName,
            filetype: fileType,
            url: fileUrl ,
            savedToDB: result.rows[0]
        })

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("สาเหตุที่ Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// Get Normal (Text) from Frontend
app.post('/message', async (req, res) => {
    try {
        const { username, mas_type, data } = req.body;

        const result = await insertIntoDB(
            username || "User",
            mas_type,
            data,
        ); 

        console.log({ Status: "Success!", savedMessage: result.rows[0]});

        res.status(200).json(result.rows[0]);

    } catch (Error) {
        console.error("Error saving message:", Error);
        res.status(500).json({ error: Error.message });
    }
});

// const http = require('http')
// const server = http.createServer(app)
// const io = require('socket.io')(server, {
//   cors: { origin: "*" } 
// });

// io.on('connection', (socket) => {

//   console.log('Log in')
//   // 1. Listening for a message from a specific client
//   socket.on('chat-message', (data) => {
//     console.log(`User ${socket.id} sent: ${data}`);

//     // 3. Sending back to EVERYONE including the sender
//     io.emit('new-message', data);
//   });
// });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));