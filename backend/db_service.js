const db = require('./db');
const { v4: uuidv4 } = require('uuid');

/**
 * 
 * @param {String} username - ชื่อผู้ใช้ถ้าไม่ใส่จะเป็น anon
 * @param {String} msg_type - ประเภทของไฟล์
 * @param {Array} jsonData
 * @returns 
 */
const insertIntoDB = async (username, msg_type, jsonData) => {
    const id = uuidv4();
    const sql = `INSERT INTO messages (id, username, msg_type, data) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(sql, [id, username, msg_type, jsonData]);

    return result
};

const getAllMessages = async () => {
    const sql = `SELECT * FROM messages`;
    const result = await db.query(sql);
    return result.rows;
}

const checkUsernameExists = async (username) => {
    const sql = `SELECT COUNT(*) FROM messages WHERE username = $1`;
    const result = await db.query(sql, [username]);
    return parseInt(result.rows[0].count) > 0;
}

module.exports = { insertIntoDB, getAllMessages, checkUsernameExists }