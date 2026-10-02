from fastapi import FastAPI
from pydantic import BaseModel
from ai_graph import revenue_graph

app = FastAPI(title="RevenueRescue AI Service")


class Opportunity(BaseModel):
    lead_score: float
    deal_value: float
    probability: float
    deal_stage: str


@app.get("/")
def root():
    return {"message": "RevenueRescue AI Service is running!"}


@app.post("/analyze")
def analyze(opportunity: Opportunity):
    result = revenue_graph.invoke({
        "lead_score": opportunity.lead_score,
        "deal_value": opportunity.deal_value,
        "probability": opportunity.probability,
        "deal_stage": opportunity.deal_stage,
        "priority_level": "",
        "recommendation": ""
    })

    return {
        "priority_level": result["priority_level"],
        "recommendation": result["recommendation"]
    }
