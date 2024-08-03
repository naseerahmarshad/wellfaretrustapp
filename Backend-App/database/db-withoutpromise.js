import mysql from 'mysql2';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const dbwithoutpromise = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export default dbwithoutpromise;