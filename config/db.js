import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL database connected successfully');
    } catch (err) {
        console.error('Error connecting to the database', err);
        process.exit(1);
    }
};

export default connectDB;
