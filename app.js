require('dotenv').config(); // for environment || .env
const express = require('express');
const app = express();
const db = require("./db"); // for database
const multer = require('multer');
const cors = require('cors');

const { uploadFile } = require("./upload");

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
        const fileUrl = await uploadFile(
            req.file.buffer,
            "Text", 
            Date.now() + "-" + originalName,
            req.file.mimetype
        );
        console.log({ status: "Success!", filename: originalName, url: fileUrl })
        res.json({ filename: originalName, url: fileUrl });
    } catch (error) {
        console.error("สาเหตุที่ Error:", error);
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));