import mysql from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config();

function getEnv(key: string) {
    if (!key) {
        throw new Error("Database Credential undefined!");
    }

    return key;
}

const pool = mysql.createPool({
    host: process.env[getEnv("MYSQL_HOST")],
    database: process.env[getEnv("MYSQL_DB")],
    user: process.env[getEnv("MYSQL_USER")],
    password: process.env[getEnv("MYSQL_PASSWORD")],
});

export {
    pool
}