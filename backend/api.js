const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const { uploadFile } = require("./upload");
const { insertIntoDB, checkUsernameExists } = require("./db_service");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));


// ------------------------------------------------------------
// API's for Upload File (Image/others file) into Cloud & DB
// ------------------------------------------------------------
const upload = multer();
app.post('/sendFile', upload.single('file'), async (req, res) => {
    console.log("===================================");
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'กรุณาเลือกไฟล์' });
        }

        const username = req.body.username;
        const originalName = req.file.originalname;
        const msgType = "file";
        const fileType = req.file.mimetype;

        console.log('ข้อมูลไฟล์:', req.file);

        // Upload to R2
        const fileUrl = await uploadFile(
            req.file.buffer,
            "DataCommu", 
            Date.now() + "-" + originalName,
            fileType
        );

        // Commit into Database
        const result = await insertIntoDB(
            username,
            msgType,
            { filename: originalName, filetype: fileType, url: fileUrl }
        );

        console.log({ 
            status: "Success!", 
            DB: result.rows[0]
        })

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("สาเหตุที่ Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// Get Normal (Text) from Frontend

// ------------------------------------------------------------
// API's for Upload File (Image/others file) through Cloud & DB
// ------------------------------------------------------------
app.post('/message', async (req, res) => {
    try {
        const { username, mas_type, data } = req.body;

        if (!username || !mas_type || !data) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Commit into Database
        const result = await insertIntoDB(
            username,
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


app.get('/userAlreadyExist', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: 'กรุณาระบุชื่อผู้ใช้' });
        }
        
        res.status(200).json(await checkUsernameExists(username));
    } catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {app};