const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const initDB = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        username VARCHAR(50),
        msg_type VARCHAR(20),
        data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`;
    try {
        await pool.query(queryText);
        console.log(" 💜 Database Table Ready ヾ(≧▽≦*)o");
    } catch (err) {
        console.error("DB Init Error:", err);
    }
};

initDB();


module.exports = {
    query: (text, params) => pool.query(text, params)
};