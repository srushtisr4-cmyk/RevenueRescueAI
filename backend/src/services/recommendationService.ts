export interface RecommendationData {
  lead_score: number | string | null;
  lead_status: string | null;
  deal_value: number | string | null;
  probability: number | string | null;
  deal_stage: string | null;
  last_contacted_at: string | null;
}

export function generateRecommendation(data: RecommendationData) {
  const leadScore = Number(data.lead_score ?? 0);
  const dealValue = Number(data.deal_value ?? 0);
  const probability = Number(data.probability ?? 0);
  const stage = data.deal_stage?.toLowerCase() ?? "";

  let reason = "";
  let action = "";

  // Priority reasoning
  if (leadScore >= 80 && probability >= 70) {
    reason = `High lead engagement combined with a ${formatCurrency(
      dealValue
    )} open deal at ${probability}% probability.`;
  } else if (leadScore >= 70) {
    reason = `Strong lead score of ${leadScore} indicates high customer interest.`;
  } else if (probability >= 70) {
    reason = `The deal has a strong ${probability}% probability of closing.`;
  } else if (dealValue >= 1000000) {
    reason = `The opportunity has a significant deal value of ${formatCurrency(
      dealValue
    )}.`;
  } else {
    reason = "The opportunity requires further qualification.";
  }

  // Recommended action
  switch (stage) {
    case "proposal":
      action =
        "Follow up with the decision-maker and move the proposal toward negotiation.";
      break;

    case "negotiation":
      action =
        "Engage the decision-maker and work toward closing the deal.";
      break;

    case "qualified":
      action =
        "Schedule a discovery call and identify the customer's key requirements.";
      break;

    case "discovery":
      action =
        "Continue discovery and qualify the customer's budget, authority, and timeline.";
      break;

    default:
      action =
        "Contact the lead and determine the next qualification step.";
  }

  return {
    reason,
    action
  };
}

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}