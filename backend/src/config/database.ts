import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "revenue_rescue",
  password: "Sru-456",
  port: 5432,
});