import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Use environment variable for database URL
// For local testing: postgresql://user:password@localhost:5432/transitops
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/transitops";

const client = new Pool({
  connectionString,
});

export const db = drizzle(client);
