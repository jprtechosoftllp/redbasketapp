import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  schema: './packages/backend/schema/*',
  out: './packages/backend/drizzle',
  dialect: 'postgresql',
 dbCredentials: {
  url: process.env.DATABASE_URL!
}
  // dbCredentials: {
  //   host: process.env.POSTGRES_HOST || 'localhost',
  //   port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  //   user: process.env.POSTGRES_USER || 'postgres',
  //   password: process.env.POSTGRES_PASSWORD! || 'root',
  //   database: process.env.POSTGRES_DATABASE_NAME || 'redbasketapp',
  //   ssl: {
  //     rejectUnauthorized: false, // ✅ disables cert validation for self-signed certs
  //   },
  // },
});