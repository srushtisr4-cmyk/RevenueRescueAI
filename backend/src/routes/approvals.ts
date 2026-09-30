import { Router, type Request, type Response } from "express";
import { pool } from "../config/database.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM approvals ORDER BY approval_id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching approvals:", error);

    res.status(500).json({
      error: "Failed to fetch approvals"
    });
  }
});

export default router;