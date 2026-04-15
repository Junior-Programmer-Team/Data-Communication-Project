const db = require('./db');

/**
 * 
 * @param {String} username - ชื่อผู้ใช้ถ้าไม่ใส่จะเป็น anon
 * @param {String} msg_type - ประเภทของไฟล์
 * @param {Array} jsonData
 * @returns 
 */
const insertIntoDB = async (username="anon", msg_type="image", jsonData) => {
    const sql = `INSERT INTO messages (username, msg_type, data) VALUES ($1, $2, $3) RETURNING *`;
    const result = await db.query(sql, [username, msg_type, jsonData]);

    return result
};

module.exports = { insertIntoDB }