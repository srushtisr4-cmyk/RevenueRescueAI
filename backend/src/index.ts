import express from "express";
import cors from "cors";
import accountsRouter from "./routes/accounts.js";
import leadsRouter from "./routes/leads.js";
import dealsRouter from "./routes/deals.js";
import activitiesRouter from "./routes/activities.js";
import communicationsRouter from "./routes/communications.js";
import supportTicketsRouter from "./routes/supportTickets.js";
import transactionsRouter from "./routes/transactions.js";
import recommendationsRouter from "./routes/recommendations.js";
import approvalsRouter from "./routes/approvals.js";
import pipelineRouter from "./routes/pipeline.js";
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "RevenueRescue AI Backend is running!"
  });
});

app.use("/api/accounts", accountsRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/communications", communicationsRouter);
app.use("/api/support-tickets", supportTicketsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/approvals", approvalsRouter);
app.use("/api/pipeline", pipelineRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});