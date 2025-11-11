import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false, // use proper CA cert in production
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const postgresDB = drizzle(pool);

pool.connect()
  .then(() => console.log('✅ Postgres pool connected successfully'))
  .catch((error) => {
    console.error('❌ Postgres connection error:', error.message);
    process.exit(1);
  });

export default postgresDB;