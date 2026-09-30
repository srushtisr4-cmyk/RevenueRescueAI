import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface PipelineItem {
  lead_id: string;
  lead_name: string;
  company_name: string;
  lead_status: string;
  lead_score: string;
  deal_name: string;
  deal_stage: string;
  deal_value: string;
  probability: string;
  priority_score: number;
  priority_level: string;
  priority_reason?: string;
  recommended_action?: string;
  annual_revenue: string;
company_size: number;
}

function App() {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedOpportunity, setSelectedOpportunity] =
  useState<PipelineItem | null>(null);
  const highCount = pipeline.filter(
  (item) => item.priority_level === "HIGH"
).length;

const mediumCount = pipeline.filter(
  (item) => item.priority_level === "MEDIUM"
).length;

const lowCount = pipeline.filter(
  (item) => item.priority_level === "LOW"
).length;

const topOpportunity = [...pipeline].sort(
  (a, b) => b.priority_score - a.priority_score
)[0];
const scoreFactors = topOpportunity
  ? [
      {
        label: "Lead Score",
        value: Number(topOpportunity.lead_score),
        display: `${Number(topOpportunity.lead_score).toFixed(1)} / 100`,
      },
      {
        label: "Deal Probability",
        value: Number(topOpportunity.probability),
        display: `${Number(topOpportunity.probability).toFixed(0)}%`,
      },
      {
        label: "Deal Value",
        value: Math.min(
          (Number(topOpportunity.deal_value) / 1000000) * 100,
          100
        ),
        display: `₹${Number(topOpportunity.deal_value).toLocaleString("en-IN")}`,
      },
      {
        label: "Deal Stage",
        value:
          topOpportunity.deal_stage.toLowerCase() === "negotiation"
            ? 100
            : topOpportunity.deal_stage.toLowerCase() === "proposal"
            ? 75
            : topOpportunity.deal_stage.toLowerCase() === "qualified"
            ? 50
            : 25,
        display: topOpportunity.deal_stage,
      },
    ]
  : [];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/pipeline")
      .then((response) => {
        setPipeline(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch pipeline:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>RevenueRescue AI</h1>
          <p>AI-powered pipeline prioritization</p>
        </div>
      </header>

      <main className="dashboard">
        <section className="ai-banner">
  <div>
    <span className="ai-badge">AI ACTIVE</span>
    <h2>Revenue opportunities prioritized automatically</h2>
    <p>
      RevenueRescue AI analyzes lead engagement, deal value,
      probability, and deal stage to identify the opportunities
      that need attention.
    </p>
  </div>
</section>
        <section className="stats">
          <div className="stat-card">
  <span>Expected Revenue</span>
  <strong>
    ₹
    {pipeline
      .reduce(
        (total, item) =>
          total +
          Number(item.deal_value || 0) *
            (Number(item.probability || 0) / 100),
        0
      )
      .toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}
  </strong>
</div>
          <div className="stat-card">
  <span>Pipeline Value</span>
  <strong>
    ₹
    {pipeline
      .reduce((total, item) => total + Number(item.deal_value || 0), 0)
      .toLocaleString("en-IN")}
  </strong>
</div>
          <div className="stat-card">
            <span>Total Opportunities</span>
            <strong>{pipeline.length}</strong>
          </div>

          <div className="stat-card">
            <span>High Priority</span>
            <strong>
              {pipeline.filter((item) => item.priority_level === "HIGH").length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Medium Priority</span>
            <strong>
              {pipeline.filter((item) => item.priority_level === "MEDIUM").length}
            </strong>
          </div>
        </section>
        <section className="priority-summary">
  <div className="priority-summary-header">
    <div>
      <h2>AI Priority Distribution</h2>
      <p>Current opportunity distribution by AI priority level.</p>
    </div>
  </div>

  <div className="priority-bars">
    <div className="priority-bar-row">
      <div className="priority-bar-label">
        <span>High Priority</span>
        <strong>{highCount}</strong>
      </div>
      <div className="priority-bar">
        <div
          className="priority-bar-fill high-fill"
          style={{
            width: `${pipeline.length ? (highCount / pipeline.length) * 100 : 0}%`,
          }}
        />
      </div>
    </div>

    <div className="priority-bar-row">
      <div className="priority-bar-label">
        <span>Medium Priority</span>
        <strong>{mediumCount}</strong>
      </div>
      <div className="priority-bar">
        <div
          className="priority-bar-fill medium-fill"
          style={{
            width: `${pipeline.length ? (mediumCount / pipeline.length) * 100 : 0}%`,
          }}
        />
      </div>
    </div>

    <div className="priority-bar-row">
      <div className="priority-bar-label">
        <span>Low Priority</span>
        <strong>{lowCount}</strong>
      </div>
      <div className="priority-bar">
        <div
          className="priority-bar-fill low-fill"
          style={{
            width: `${pipeline.length ? (lowCount / pipeline.length) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  </div>
</section>
{topOpportunity && (
  <section className="top-opportunity">
    <div>
      <span className="ai-badge">AI TOP OPPORTUNITY</span>

      <h2>{topOpportunity.company_name}</h2>

      <p>
        {topOpportunity.lead_name} · {topOpportunity.deal_name}
      </p>
    </div>

    <div className="top-opportunity-score">
      <span>Priority Score</span>
      <strong>{topOpportunity.priority_score}</strong>
      <small>{topOpportunity.priority_level} PRIORITY</small>
    </div>

    <div className="top-opportunity-action">
      <strong>Recommended next action</strong>
      <p>{topOpportunity.recommended_action}</p>
    </div>
  </section>
)}
{topOpportunity && (
  <section className="explainable-ai">
    <div className="explainable-ai-header">
      <div>
        <span className="ai-badge">EXPLAINABLE AI</span>
        <h2>Why this opportunity is prioritized</h2>
        <p>
          RevenueRescue AI evaluates multiple signals before assigning
          a priority score.
        </p>
      </div>

      <div className="overall-score">
        <span>Overall Score</span>
        <strong>{topOpportunity.priority_score}</strong>
      </div>
    </div>

    <div className="score-factors">
      {scoreFactors.map((factor) => (
        <div className="score-factor" key={factor.label}>
          <div className="factor-header">
            <span>{factor.label}</span>
            <strong>{factor.display}</strong>
          </div>

          <div className="factor-bar">
            <div
              className="factor-fill"
              style={{ width: `${factor.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </section>
)}
{topOpportunity && (
  <section className="action-center">
    <div className="action-center-content">
      <span className="ai-badge">AI SALES ACTION</span>

      <h2>Recommended next step</h2>

      <p>{topOpportunity.recommended_action}</p>
    </div>

    <button
      className="action-button"
      onClick={() =>
        alert(
          `Action selected for ${topOpportunity.company_name}`
        )
      }
    >
      Take Action →
    </button>
  </section>
)}

        <section className="pipeline-section">
  <div className="pipeline-header">
    <h2>Priority Pipeline</h2>

    <input
      type="text"
      placeholder="Search company or lead..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />
    <select
  value={priorityFilter}
  onChange={(e) => setPriorityFilter(e.target.value)}
  className="priority-filter"
>
  <option value="ALL">All Priorities</option>
  <option value="HIGH">High</option>
  <option value="MEDIUM">Medium</option>
  <option value="LOW">Low</option>
</select>
  </div>

          {loading ? (
            <p>Loading pipeline...</p>
          ) : pipeline.length === 0 ? (
            <p>No pipeline opportunities found.</p>
          ) : (
            <div className="pipeline-list">
  {pipeline
  .filter((item) =>
    `${item.company_name} ${item.lead_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter(
    (item) =>
      priorityFilter === "ALL" ||
      item.priority_level === priorityFilter
  )
    .map((item) => (
                <div
  className="pipeline-card"
  key={item.lead_id}
  onClick={() => setSelectedOpportunity(item)}
>
                  <div>
                    <h3>{item.company_name}</h3>
                    <p>{item.lead_name}</p>
                    <p>{item.deal_name}</p>
                    <span className="deal-stage">
  Stage: {item.deal_stage}
</span>
<p className="deal-value">
  Deal Value: ₹{Number(item.deal_value).toLocaleString("en-IN")}
</p>
                  </div>

                  <div className="priority-info">
  <div>
    <span className={`priority ${item.priority_level.toLowerCase()}`}>
      {item.priority_level}
    </span>

    <strong className="score">
      {item.priority_score}
    </strong>
    <span className="probability">
  {item.probability}% probability
</span>
  </div>

  <div className="ai-insight">
    <strong>Why this opportunity?</strong>
    <p>{item.priority_reason}</p>
  </div>

  <div className="ai-action">
    <strong>Recommended action</strong>
    <p>{item.recommended_action}</p>
  </div>
</div>
</div>
              ))}
            </div>
          )}
        </section>
        {selectedOpportunity && (
  <section className="opportunity-details">
    <div className="details-header">
      <div>
        <span className="ai-badge">AI ANALYSIS</span>
        <h2>{selectedOpportunity.company_name}</h2>
        <p>{selectedOpportunity.lead_name}</p>
      </div>

      <button
        className="close-button"
        onClick={() => setSelectedOpportunity(null)}
      >
        ×
      </button>
    </div>

    <div className="details-grid">
      <div>
        <span>Deal</span>
        <strong>{selectedOpportunity.deal_name}</strong>
      </div>

      <div>
        <span>Deal Stage</span>
        <strong>{selectedOpportunity.deal_stage}</strong>
      </div>

      <div>
        <span>Deal Value</span>
        <strong>
          ₹{Number(selectedOpportunity.deal_value).toLocaleString("en-IN")}
        </strong>
      </div>

      <div>
        <span>Probability</span>
        <strong>{selectedOpportunity.probability}%</strong>
      </div>

      <div>
        <span>Priority Score</span>
        <strong>{selectedOpportunity.priority_score}</strong>
      </div>

      <div>
        <span>Priority</span>
        <strong>{selectedOpportunity.priority_level}</strong>
      </div>
    </div>

    <div className="detail-insight">
      <h3>Why this opportunity?</h3>
      <p>{selectedOpportunity.priority_reason}</p>
    </div>

    <div className="detail-action">
      <h3>Recommended next action</h3>
      <p>{selectedOpportunity.recommended_action}</p>
    </div>
  </section>
)}
      </main>
    </div>
  );
}

export default App;