import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

interface PipelineItem {
  lead_id: string;
  lead_name: string;
  lead_source?: string;
  lead_status?: string;
  lead_score?: number | string | null;
  last_contacted_at?: string | null;

  account_id?: string;
  company_name?: string;
  industry?: string;
  company_size?: number | string | null;
  location?: string;
  annual_revenue?: number | string | null;
  account_status?: string;

  deal_id?: string;
  deal_name?: string;
  deal_stage?: string | null;
  deal_value?: number | string | null;
  probability?: number | string | null;
  expected_close_date?: string | null;
  deal_status?: string;

  priority_score?: number | string | null;
  priority_level?: string;
  priority_reason?: string;
  recommended_action?: string;
}

const API_URL =
  "https://revenuerescueai-2.onrender.com/api/pipeline";

function money(value: number | string | null | undefined) {
  const n = Number(value ?? 0);

  if (!n) return "₹0";

  if (n >= 10000000) {
    return `₹${(n / 10000000).toFixed(1)}Cr`;
  }

  if (n >= 100000) {
    return `₹${(n / 100000).toFixed(1)}L`;
  }

  return `₹${n.toLocaleString("en-IN")}`;
}

function score(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(1);
}

function priorityClass(level?: string) {
  const value = level?.toUpperCase();

  if (value === "HIGH") return "priority high";
  if (value === "MEDIUM") return "priority medium";
  return "priority low";
}

function App() {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Overview");
  const [selected, setSelected] = useState<PipelineItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPipeline() {
      try {
        const response = await axios.get<PipelineItem[]>(API_URL);
        setPipeline(response.data);
      } catch (error) {
        console.error("Pipeline loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPipeline();
  }, []);

  const filteredPipeline = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return pipeline;

    return pipeline.filter((item) =>
      [
        item.lead_name,
        item.company_name,
        item.deal_name,
        item.deal_stage,
        item.priority_level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [pipeline, search]);

  const totalPipeline = useMemo(
    () =>
      pipeline.reduce(
        (sum, item) => sum + Number(item.deal_value ?? 0),
        0
      ),
    [pipeline]
  );

  const weightedRevenue = useMemo(
    () =>
      pipeline.reduce(
        (sum, item) =>
          sum +
          Number(item.deal_value ?? 0) *
            (Number(item.probability ?? 0) / 100),
        0
      ),
    [pipeline]
  );

  const averageScore = useMemo(() => {
    if (!pipeline.length) return 0;

    return (
      pipeline.reduce(
        (sum, item) => sum + Number(item.priority_score ?? 0),
        0
      ) / pipeline.length
    );
  }, [pipeline]);

  const highPriorityCount = pipeline.filter(
    (item) => item.priority_level?.toUpperCase() === "HIGH"
  ).length;

  const featured = pipeline[0];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-mark">R</div>
        <p>Loading RevenueRescue AI...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>

          <div>
            <div className="brand-name">RevenueRescue AI</div>
            <div className="brand-subtitle">
              Revenue Intelligence
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">WORKSPACE</div>

          <button
  className={`nav-link ${activeSection === "Overview" ? "active" : ""}`}
  onClick={() => setActiveSection("Overview")}
>
  <span>Overview</span>
</button>

         <button
  className={`nav-link ${activeSection === "Pipeline" ? "active" : ""}`}
  onClick={() => setActiveSection("Pipeline")}
>
  <span>Pipeline</span>
</button>

          <button
  className={`nav-link ${activeSection === "AI Insights" ? "active" : ""}`}
  onClick={() => setActiveSection("AI Insights")}
>
  <span>AI Insights</span>
</button>

          <button
  className={`nav-link ${activeSection === "Accounts" ? "active" : ""}`}
  onClick={() => setActiveSection("Accounts")}
>
  <span>Accounts</span>
</button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">ANALYTICS</div>

          <button
  className={`nav-link ${activeSection === "Performance" ? "active" : ""}`}
  onClick={() => setActiveSection("Performance")}
>
  <span>Performance</span>
</button>

          <button
  className={`nav-link ${activeSection === "Forecast" ? "active" : ""}`}
  onClick={() => setActiveSection("Forecast")}
>
  <span>Forecast</span>
</button>
          <button
  className={`nav-link ${activeSection === "Activity" ? "active" : ""}`}
  onClick={() => setActiveSection("Activity")}
>
  <span>Activity</span>
</button>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-label">SYSTEM</div>

          <div className="system-status">
            <span className="online-dot" />
            <div>
              <strong>AI Engine Online</strong>
              <small>Ollama · LangGraph</small>
            </div>
          </div>

          <div className="sidebar-footer">
            <span className="footer-avatar">SR</span>

            <div>
              <strong>Revenue Team</strong>
              <small>Administrator</small>
            </div>

            <span className="footer-arrow">⌄</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities..."
              />
            </div>

            <div className="profile-avatar">SR</div>
          </div>
        </header>
        {activeSection === "Pipeline" && (
  <section className="panel opportunities" style={{ marginTop: "24px" }}>
    <div className="panel-heading">
      <div>
        <span className="eyebrow">REVENUE PIPELINE</span>
        <h2>All opportunities</h2>
      </div>

      <span className="live-label">
        <i /> {filteredPipeline.length} OPPORTUNITIES
      </span>
    </div>

    <div className="table">
      <div className="table-head">
        <span>ACCOUNT</span>
        <span>STAGE</span>
        <span>VALUE</span>
        <span>PROBABILITY</span>
        <span>AI SCORE</span>
        <span>PRIORITY</span>
      </div>

      {filteredPipeline.map((item) => (
        <button
          className="table-row"
          key={item.lead_id}
          onClick={() => setSelected(item)}
        >
          <div className="account-cell">
            <div className="mini-company">
              {item.company_name?.charAt(0) || "R"}
            </div>

            <div>
              <strong>{item.company_name || "Unknown company"}</strong>
              <small>{item.lead_name}</small>
            </div>
          </div>

          <span>{item.deal_stage || "—"}</span>
          <strong>{money(item.deal_value)}</strong>
          <span>{Number(item.probability ?? 0).toFixed(0)}%</span>

          <strong className="score-value">
            {score(item.priority_score)}
          </strong>

          <span className={priorityClass(item.priority_level)}>
            {item.priority_level || "LOW"}
          </span>
        </button>
      ))}

      {!filteredPipeline.length && (
        <div className="empty-table">
          No matching opportunities found.
        </div>
      )}
    </div>
  </section>
)}

        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <div className="ai-badge">
              <span>✦</span>
              AI Engine Active
            </div>

            <h1>
              Turn your pipeline into
              <br />
              <em>predictable revenue</em>
            </h1>

            <p>
              RevenueRescue AI continuously analyzes your sales
              opportunities and identifies exactly where your team
              should focus next.
            </p>

            <div className="hero-tags">
              <span>Live pipeline analysis</span>
              <span>Explainable AI</span>
              <span>Revenue prioritization</span>
            </div>
          </div>

          <div className="hero-revenue">
            <span>AI-forecasted revenue this cycle</span>

            <strong>{money(weightedRevenue)}</strong>

            <small>
              Based on {pipeline.length} active opportunity
              {pipeline.length !== 1 ? "ies" : ""}
            </small>
          </div>
        </section>

        {/* METRICS */}
        <section className="metrics">
          <div className="metric">
            <span className="metric-title">PIPELINE VALUE</span>
            <strong>{money(totalPipeline)}</strong>
            <small>Open opportunity value</small>
          </div>

          <div className="metric">
            <span className="metric-title">AI PRIORITY SCORE</span>
            <strong>{score(averageScore)}</strong>
            <small>Average opportunity score</small>
          </div>

          <div className="metric">
            <span className="metric-title">HIGH PRIORITY</span>
            <strong>{highPriorityCount}</strong>
            <small>Needs attention now</small>
          </div>

          <div className="metric">
            <span className="metric-title">OPPORTUNITIES</span>
            <strong>{pipeline.length}</strong>
            <small>Currently analyzed</small>
          </div>
        </section>

        {/* FEATURE ROW */}
        <section className="feature-grid">
          {/* PIPELINE CARD */}
          <div className="panel pipeline-card">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">REVENUE PIPELINE</span>
                <h2>Opportunity overview</h2>
              </div>

              <button className="view-button">
                View pipeline →
              </button>
            </div>

            <div className="pipeline-visual">
              <div className="pipeline-total">
                <span>Total pipeline</span>
                <strong>{money(totalPipeline)}</strong>
              </div>

              <div className="pipeline-bars">
                <div className="pipeline-bar-row">
                  <span>Qualified</span>
                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "72%" }}
                    />
                  </div>
                  <b>72%</b>
                </div>

                <div className="pipeline-bar-row">
                  <span>Proposal</span>
                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "56%" }}
                    />
                  </div>
                  <b>56%</b>
                </div>

                <div className="pipeline-bar-row">
                  <span>Negotiation</span>
                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "38%" }}
                    />
                  </div>
                  <b>38%</b>
                </div>
              </div>
            </div>
          </div>

          {/* AI CARD */}
          <div className="panel ai-insight-card">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">AI RECOMMENDATION</span>
                <h2>Where to focus next</h2>
              </div>

              <span className="spark">✦</span>
            </div>

            {featured ? (
              <>
                <div className="insight-company">
                  <div className="company-icon">
                    {featured.company_name?.charAt(0) || "R"}
                  </div>

                  <div>
                    <strong>
                      {featured.company_name ||
                        "Priority opportunity"}
                    </strong>

                    <span>
                      {featured.deal_name || "Open opportunity"}
                    </span>
                  </div>

                  <span className={priorityClass(featured.priority_level)}>
                    {featured.priority_level || "HIGH"}
                  </span>
                </div>

                <div className="insight-score">
                  <span>AI PRIORITY SCORE</span>
                  <strong>{score(featured.priority_score)}</strong>
                </div>

                <p className="insight-reason">
                  {featured.priority_reason ||
                    "AI has identified this opportunity as a key revenue focus."}
                </p>

                <div className="recommendation">
                  <span>RECOMMENDED ACTION</span>
                  <p>
                    {featured.recommended_action ||
                      "Follow up with the decision-maker and move the opportunity forward."}
                  </p>
                </div>
              </>
            ) : (
              <div className="empty-state">
                No opportunities available.
              </div>
            )}
          </div>
        </section>

        {/* OPPORTUNITIES */}
        <section className="panel opportunities">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">LIVE DATA</span>
              <h2>Top opportunities</h2>
            </div>

            <span className="live-label">
              <i /> LIVE
            </span>
          </div>

          <div className="table">
            <div className="table-head">
              <span>ACCOUNT</span>
              <span>STAGE</span>
              <span>VALUE</span>
              <span>PROBABILITY</span>
              <span>AI SCORE</span>
              <span>PRIORITY</span>
            </div>

            {filteredPipeline.map((item) => (
              <button
                className="table-row"
                key={item.lead_id}
                onClick={() => setSelected(item)}
              >
                <div className="account-cell">
                  <div className="mini-company">
                    {item.company_name?.charAt(0) || "R"}
                  </div>

                  <div>
                    <strong>
                      {item.company_name || "Unknown company"}
                    </strong>

                    <small>{item.lead_name}</small>
                  </div>
                </div>

                <span>{item.deal_stage || "—"}</span>

                <strong>{money(item.deal_value)}</strong>

                <span>
                  {Number(item.probability ?? 0).toFixed(0)}%
                </span>

                <strong className="score-value">
                  {score(item.priority_score)}
                </strong>

                <span className={priorityClass(item.priority_level)}>
                  {item.priority_level || "LOW"}
                </span>
              </button>
            ))}

            {!filteredPipeline.length && (
              <div className="empty-table">
                No matching opportunities found.
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <span>RevenueRescue AI</span>
          <span>AI-powered revenue intelligence</span>
          <span>Pipeline synchronized</span>
        </footer>
      </main>

      {/* DETAIL MODAL */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="opportunity-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <span className="eyebrow">OPPORTUNITY DETAILS</span>

            <h2>
              {selected.company_name ||
                selected.deal_name ||
                "Opportunity"}
            </h2>

            <p className="modal-lead">
              {selected.lead_name}
            </p>

            <div className="modal-stats">
              <div>
                <span>DEAL VALUE</span>
                <strong>{money(selected.deal_value)}</strong>
              </div>

              <div>
                <span>AI SCORE</span>
                <strong>{score(selected.priority_score)}</strong>
              </div>

              <div>
                <span>PROBABILITY</span>
                <strong>
                  {Number(selected.probability ?? 0).toFixed(0)}%
                </strong>
              </div>

              <div>
                <span>STAGE</span>
                <strong>{selected.deal_stage || "—"}</strong>
              </div>
            </div>

            <div className="modal-section">
              <span>WHY THIS MATTERS</span>

              <p>
                {selected.priority_reason ||
                  "This opportunity has been identified by the AI decision engine for further attention."}
              </p>
            </div>

            <div className="modal-section recommendation-box">
              <span>NEXT BEST ACTION</span>

              <p>
                {selected.recommended_action ||
                  "Follow up with the opportunity and move the deal forward."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;