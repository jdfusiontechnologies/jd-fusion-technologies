import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sqlHost = process.env.SQL_HOST || 'localhost';
const sqlDbName = process.env.SQL_DB_NAME || 'postgres';
const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER || 'postgres';
const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD || '';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: databaseUrl
    ? {
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: sqlHost,
        user: user,
        password: password,
        database: sqlDbName,
        ssl: false,
      },
  verbose: true,
});
