import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // use proper CA cert in production
  }
});

// Optional: catch unexpected pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected Postgres error:', err.message);
});

const postgresDB = drizzle(pool);

export default postgresDB;