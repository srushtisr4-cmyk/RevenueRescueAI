import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});


& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "postgresql://revenue_rescue_user:WCLAj05LhUIrGRluceqDRDlUxGu202ip@dpg-dauk58ou01pc7381n0vg-a.oregon-postgres.render.com/revenue_rescue"