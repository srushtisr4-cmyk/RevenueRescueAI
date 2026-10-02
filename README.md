# RevenueRescue AI
### AI-Powered Revenue Intelligence & Opportunity Prioritization
## 💡 Project Overview

RevenueRescue AI is an AI-powered revenue intelligence platform that helps sales teams identify high-priority opportunities and determine what action should be taken next.

It analyzes leads, accounts, and deals using factors such as lead engagement, deal value, probability, and sales stage, and converts this information into a priority score, priority level, reasoning, and recommended action.
## 🎯 Problem Statement

Sales teams often manage multiple leads and deals simultaneously. Although large amounts of sales data are available, it can be difficult to determine which opportunities deserve immediate attention.

RevenueRescue AI addresses this problem by converting raw sales data into clear, actionable opportunity insights.
## 🚀 Solution

RevenueRescue AI combines structured business data, priority scoring, and AI-assisted reasoning to answer three key questions:

- Which opportunity needs attention?
- Why is it important?
- What should the salesperson do next?
## ✨ Key Features

- AI-assisted opportunity prioritization
- Lead, account, and deal analysis
- Priority scoring
- Priority classification
- Explainable priority reasoning
- AI-generated recommended actions
- Interactive sales pipeline
- Opportunity search
- Detailed opportunity view
- Revenue insights dashboard
  ## 🛠️ Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- TypeScript
- Express

**Database**
- PostgreSQL
- pgvector

**AI**
- Python
- FastAPI
- LangGraph
- LangChain
- Llama 3.2
- Ollama

**Deployment & Tools**
- GitHub
- Vercel
- Render
- Docker
  ## 🏗️ System Architecture

React Frontend
↓
Node.js + Express Backend
↓
PostgreSQL
↓
Priority Scoring Engine
↓
Python + FastAPI AI Service
↓
LangGraph + LangChain
↓
Llama 3.2
## 📁 Project Structure

RevenueRescueAI/
├── ai-service/
├── backend/
├── frontend/
└── README.md
## ⚙️ Setup & Installation

### Clone the repository

git clone https://github.com/srushtisr4-cmyk/RevenueRescueAI.git

cd RevenueRescueAI
## 🔐 Environment Variables

Create a `.env` file in the backend directory and add:

DATABASE_URL=your_postgresql_connection_string

Do not commit `.env` files or database credentials to GitHub.
## ▶️ How to Run

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

### AI Service
cd ai-service
## 📊 Example

Company: TechNova Solutions

Deal Value: ₹25,00,000
Probability: 75%
Deal Stage: Proposal

Priority Score: 80.5
Priority Level: HIGH

Recommended Action:
Follow up with the decision-maker and move the proposal toward negotiation.
## 🌐 Live Demo

https://revenue-rescue-ai-phi.vercel.app/
## 🔗 Backend API

https://revenuerescueai-2.onrender.com/api/pipeline
## 🔮 Future Scope

- CRM integration
- Advanced revenue forecasting
- Automated follow-ups
- Customer churn prediction
- Historical opportunity analysis
- Cloud-based AI inference
  ## 👥 Team

RevenueRescue AI was developed collaboratively, with contributions across frontend development, backend engineering, database integration, and AI implementation.
