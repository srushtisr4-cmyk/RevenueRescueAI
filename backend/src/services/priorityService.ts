export interface PipelineData {
  lead_score: number | string | null;
  deal_value: number | string | null;
  probability: number | string | null;
  deal_stage: string | null;
}

export function calculatePriorityScore(data: PipelineData): number {
  const leadScore = Number(data.lead_score ?? 0);
  const dealValue = Number(data.deal_value ?? 0);
  const probability = Number(data.probability ?? 0);

  // Deal value contribution: maximum 100 points
  // ₹10,00,000 or $1M equivalent in dataset = 100
  const dealValueScore = Math.min((dealValue / 1000000) * 100, 100);

  // Normalize deal stage to a 0–100 score
  let stageScore = 0;

  switch (data.deal_stage?.toLowerCase()) {
    case "proposal":
      stageScore = 75;
      break;

    case "negotiation":
      stageScore = 100;
      break;

    case "qualified":
      stageScore = 50;
      break;

    case "discovery":
      stageScore = 25;
      break;

    default:
      stageScore = 0;
  }

  const score =
    (leadScore * 0.4) +
    (probability * 0.3) +
    (dealValueScore * 0.1) +
    (stageScore * 0.2);

  return Math.min(Math.round(score * 100) / 100, 100);
}

export function getPriorityLevel(score: number): string {
  if (score >= 75) {
    return "HIGH";
  }

  if (score >= 50) {
    return "MEDIUM";
  }

  return "LOW";
}