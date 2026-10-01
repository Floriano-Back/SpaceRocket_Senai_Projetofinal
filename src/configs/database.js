import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,   // defaultdb
  ssl: process.env.DB_CA ? { ca: process.env.DB_CA } : { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;