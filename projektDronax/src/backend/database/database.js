const mysql = require('promise-mysql');
require('dotenv').config({ path: '../env/.env' });

let pool;

const initDB = async () => {
    /* console.log("DB Config:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME); */

    try {
        pool = await mysql.createPool({
            connectionLimit: 10,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        return pool;
    } catch (error) {
        console.error("Error while connecting to database:", error);
        throw error;
    }
};

const getPool = async () => {
    if(!pool) {
        pool = await initDB();
    }
    return pool;
}

module.exports = getPool;
