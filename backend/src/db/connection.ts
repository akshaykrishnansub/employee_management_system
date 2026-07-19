import { Pool } from "pg";

import dotenv from 'dotenv';

dotenv.config();

const pool:Pool=new Pool({
    port:Number(process.env.DB_PORT),
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

export default pool;