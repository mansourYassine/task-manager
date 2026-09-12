import mysql from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config();

function getEnv(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`The ${key} is missing in the environment variables`);
    }
    return value;
}

const pool = mysql.createPool({
    host: getEnv("MYSQL_HOST"),
    database: getEnv("MYSQL_DB"),
    user: getEnv("MYSQL_USER"),
    password: getEnv("MYSQL_PASSWORD"),
});

export {
    pool
}