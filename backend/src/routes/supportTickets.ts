import { Router, type Request, type Response } from "express";
import { pool } from "../config/database.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM support_tickets ORDER BY ticket_id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching support tickets:", error);

    res.status(500).json({
      error: "Failed to fetch support tickets"
    });
  }
});

export default router;