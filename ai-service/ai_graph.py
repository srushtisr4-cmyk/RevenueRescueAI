import os
from typing import TypedDict

from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, END


load_dotenv()


class RevenueState(TypedDict):
    lead_score: float
    deal_value: float
    probability: float
    deal_stage: str
    priority_level: str
    recommendation: str


llm = ChatOllama(
    model="llama3.2:3b",
    temperature=0
)


def analyze_opportunity(state: RevenueState):
    score = (
        state["lead_score"] * 0.4
        + state["probability"] * 0.3
        + min((state["deal_value"] / 1000000) * 100, 100) * 0.1
    )

    if state["deal_stage"].lower() == "proposal":
        score += 75 * 0.2
    elif state["deal_stage"].lower() == "negotiation":
        score += 100 * 0.2
    elif state["deal_stage"].lower() == "qualified":
        score += 50 * 0.2

    if score >= 75:
        level = "HIGH"
    elif score >= 50:
        level = "MEDIUM"
    else:
        level = "LOW"

    prompt = f"""
You are the AI decision engine for RevenueRescue AI.

Analyze this sales opportunity:

Lead score: {state["lead_score"]}
Deal value: ₹{state["deal_value"]:,.0f}
Probability: {state["probability"]}%
Deal stage: {state["deal_stage"]}
Priority level: {level}

Give one concise recommended action for the sales team.
Do not repeat the input data.
Return only the recommendation.
"""

    response = llm.invoke(prompt)

    return {
        "priority_level": level,
        "recommendation": response.content
    }


graph_builder = StateGraph(RevenueState)

graph_builder.add_node("analyze_opportunity", analyze_opportunity)
graph_builder.set_entry_point("analyze_opportunity")
graph_builder.add_edge("analyze_opportunity", END)

revenue_graph = graph_builder.compile()