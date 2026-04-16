const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const s3 = new S3Client({ // ตั้งค่า S3 Client สำหรับ Cloudflare R2
    region: "auto",
    endpoint: process.env.R2_URL,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const domainUrl = process.env.DOMAIN_URL || "";

/**
 * ฟังก์ชันสำหรับ Upload ไฟล์ ลง Cloudflare
 * @param {string} localPath - ที่อยู่ไฟล์ในเครื่อง
 * @param {string} bucket - ชื่อ Bucket
 * @param {string} key - ชื่อไฟล์ที่จะตั้งบน Cloud
 */
async function uploadFile(fileBuffer, bucket, key, contentType) {
    try {
        console.log("============================");
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType
        });

        await s3.send(command);
        
        const fullUrl = `${domainUrl}${bucket}/${key}`;
        return fullUrl;
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    }
}

module.exports = { uploadFile };