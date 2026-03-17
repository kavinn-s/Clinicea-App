import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing connection to:', process.env.DATABASE_URL.replace(/\/\/.*?:.*?@/, '//***:***@'));

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runTest() {
    console.log('Attempting to connect...');
    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Result:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('❌ Connection error:');
        console.error(err);
    } finally {
        await pool.end();
    }
}

runTest();
