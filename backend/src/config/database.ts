import "dotenv/config";
import { Pool } from "pg";

console.log("DATABASE CONFIG LOADED");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length);
console.log("DATABASE_URL starts:", process.env.DATABASE_URL?.substring(0, 25));

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});