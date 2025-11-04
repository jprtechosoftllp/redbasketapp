import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const client = new pg.Client({
//   host: process.env.POSTGRES_HOST || 'localhost',
//   port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
//   user: process.env.POSTGRES_USER || 'postgres',
//   password: process.env.POSTGRES_PASSWORD || 'root',
//   database: process.env.POSTGRES_DATABASE_NAME || 'redbasketapp',
connectionString: process.env.DATABASE_URL!, // ← this must be defined
});

client.connect()
  .then(() => console.log('✅ Postgres connected successfully'))
  .catch((error) => {
    console.error('❌ Postgres connection error:', error);
    process.exit(1); // Optional: exit if connection fails
  });

const postgresDB = drizzle(client);

export default postgresDB;
// import dotenv from 'dotenv';
// dotenv.config();
// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';

// const postgresDB = drizzle(process.env.DATABASE_URL!);

// export default postgresDB
