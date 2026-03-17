import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// This creates a pool of connections to your Supabase/PostgreSQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // If using Supabase, SSL is usually required
    ssl: {
        rejectUnauthorized: false 
    }
});

// Test the connection
pool.connect()
    .then(() => console.log('📦 Successfully connected to PostgreSQL!'))
    .catch(err => console.error('Database connection error:', err.stack));

// Add this line right after you create the 'pool'
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Do not process.exit() - this keeps the server alive!
});

export default pool;