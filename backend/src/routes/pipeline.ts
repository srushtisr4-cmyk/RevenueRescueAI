import { Router, type Request, type Response } from "express";
import { pool } from "../config/database.ts";
import {
  calculatePriorityScore,
  getPriorityLevel
} from "../services/priorityService.js";
import { generateRecommendation } from "../services/recommendationService.js";
import { analyzeWithAI } from "../services/aiService.js";
const router = Router();
console.log("PIPELINE ROUTE LOADED - POOL:", !!pool);

router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("PIPELINE STEP 1 - BEFORE SQL");
    const result = await pool.query(`
      SELECT
        l.lead_id,
        l.lead_name,
        l.lead_source,
        l.lead_status,
        l.lead_score,
        l.last_contacted_at,

        a.account_id,
        a.company_name,
        a.industry,
        a.company_size,
        a.location,
        a.annual_revenue,
        a.account_status,

        d.deal_id,
        d.deal_name,
        d.deal_stage,
        d.deal_value,
        d.probability,
        d.expected_close_date,
        d.deal_status

      FROM leads l

      JOIN accounts a
        ON l.account_id = a.account_id

      LEFT JOIN deals d
        ON l.lead_id = d.lead_id

      ORDER BY l.lead_score DESC NULLS LAST
    `);

    const pipeline = await Promise.all(
  result.rows.map(async (row: any) => {
      const aiAnalysis = await analyzeWithAI({
  lead_score: row.lead_score,
  deal_value: row.deal_value,
  probability: row.probability,
  deal_stage: row.deal_stage
});
  const priorityScore = calculatePriorityScore({
    lead_score: row.lead_score,
    deal_value: row.deal_value,
    probability: row.probability,
    deal_stage: row.deal_stage
  });

  const recommendation = generateRecommendation({
    lead_score: row.lead_score,
    lead_status: row.lead_status,
    deal_value: row.deal_value,
    probability: row.probability,
    deal_stage: row.deal_stage,
    last_contacted_at: row.last_contacted_at
  });

  return {
    ...row,
    priority_score: priorityScore,
    priority_level: getPriorityLevel(priorityScore),
    priority_reason: recommendation.reason,
    recommended_action: recommendation.action,
    ai_priority_level: aiAnalysis.priority_level,
ai_recommendation: aiAnalysis.recommendation
        };
    })
  );
res.json(pipeline);

  } catch (error) {
    console.error("Error fetching pipeline data:", error);

    res.status(500).json({
  error: "Failed to fetch pipeline data",
  details: error instanceof Error ? error.message : String(error)
});
  }
});

export default router;