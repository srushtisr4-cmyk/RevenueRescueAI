import axios from "axios";

interface AIAnalysisInput {
  lead_score: number | string | null;
  deal_value: number | string | null;
  probability: number | string | null;
  deal_stage: string | null;
}

interface AIAnalysisResult {
  priority_level: string;
  recommendation: string;
}

export async function analyzeWithAI(
  data: AIAnalysisInput
): Promise<AIAnalysisResult> {
  const response = await axios.post<AIAnalysisResult>(
    "http://127.0.0.1:8001/analyze",
    {
      lead_score: Number(data.lead_score ?? 0),
      deal_value: Number(data.deal_value ?? 0),
      probability: Number(data.probability ?? 0),
      deal_stage: data.deal_stage ?? ""
    }
  );

  return response.data;
}
