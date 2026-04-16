const db = require('./db');
const { v4: uuidv4 } = require('uuid');

/**
 * 
 * @param {String} username - ชื่อผู้ใช้ถ้าไม่ใส่จะเป็น anon
 * @param {String} msg_type - ประเภทของไฟล์
 * @param {Array} jsonData
 * @returns 
 */
const insertIntoDB = async (username="anon", msg_type="image", jsonData) => {
    const id = uuidv4();
    const sql = `INSERT INTO messages (id, username, msg_type, data) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(sql, [id, username, msg_type, jsonData]);

    return result
};

module.exports = { insertIntoDB }