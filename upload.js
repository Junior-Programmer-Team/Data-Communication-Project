const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ตั้งค่า S3 Client สำหรับ Cloudflare R2
const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_URL,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const domainUrl = process.env.DOMAIN_URL;

/**
 * ฟังก์ชันสำหรับ Upload ไฟล์
 * @param {string} localPath - ที่อยู่ไฟล์ในเครื่อง
 * @param {string} bucket - ชื่อ Bucket
 * @param {string} key - ชื่อไฟล์ที่จะตั้งบน Cloud
 */
async function uploadFile(localPath, bucket, key) {
    try {
        const fileContent = fs.readFileSync(localPath);
        
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: fileContent,
            // ContentType: "image/jpeg" // แนะนำให้ใส่ตามประเภทไฟล์ครับ
        });

        await s3.send(command);
        
        // คืนค่า URL (จัดการเรื่อง / ให้ถูกต้อง)
        const fullUrl = `${domainUrl.endsWith('/') ? domainUrl : domainUrl + '/'}${bucket}/${key}`;
        return `This is file url: ${fullUrl}`;
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    }
}

// ตัวอย่างการใช้งาน (Uncomment เพื่อทดสอบ)
/*
(async () => {
    const result = await uploadFile('./test.jpg', 'my-bucket', 'uploaded-image.jpg');
    console.log(result);
})();
*/

module.exports = { uploadFile };