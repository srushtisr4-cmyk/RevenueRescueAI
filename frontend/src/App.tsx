import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

type PipelineItem = {
  lead_id: string;
  lead_name: string;
  lead_source?: string;
  lead_status?: string;
  lead_score?: number | string | null;
  last_contacted_at?: string | null;

  account_id?: string;
  company_name: string;
  industry?: string;
  company_size?: number | null;
  location?: string;
  annual_revenue?: number | string | null;
  account_status?: string;

  deal_id?: string | null;
  deal_name?: string | null;
  deal_stage?: string | null;
  deal_value?: number | string | null;
  probability?: number | string | null;
  expected_close_date?: string | null;
  deal_status?: string | null;

  priority_score?: number | string | null;
  priority_level?: string | null;
  priority_reason?: string | null;
  recommended_action?: string | null;

  ai_priority?: string | null;
  ai_recommendation?: string | null;
};

const API_URL =
  "https://revenuerescueai-2.onrender.com/api/pipeline";

function App() {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");
  const [selected, setSelected] = useState<PipelineItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadPipeline = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);
        setPipeline(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load revenue pipeline.");
      } finally {
        setLoading(false);
      }
    };

    loadPipeline();
  }, []);

  const filteredPipeline = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return pipeline;
    }

    return pipeline.filter((item) =>
      [
        item.lead_name,
        item.company_name,
        item.deal_name,
        item.deal_stage,
        item.priority_level,
        item.lead_status,
        item.industry,
        item.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [pipeline, search]);

  const totalPipelineValue = pipeline.reduce(
    (sum, item) => sum + Number(item.deal_value || 0),
    0
  );

  const averageProbability =
    pipeline.length > 0
      ? pipeline.reduce(
          (sum, item) => sum + Number(item.probability || 0),
          0
        ) / pipeline.length
      : 0;

  const highPriorityCount = pipeline.filter(
    (item) =>
      String(item.priority_level || "").toUpperCase() === "HIGH"
  ).length;

  const formatCurrency = (value: number | string | null | undefined) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityClass = (priority?: string | null) => {
    const value = String(priority || "").toUpperCase();

    if (value === "HIGH") return "priority high";
    if (value === "MEDIUM") return "priority medium";

    return "priority low";
  };

  const navigate = (section: string) => {
    setActiveSection(section);
    setSelected(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>

          <div>
            <div className="brand-name">RevenueRescue</div>
            <div className="brand-subtitle">AI Revenue Engine</div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>

          {[
            "Overview",
            "Pipeline",
            "AI Insights",
            "Accounts",
            "Performance",
            "Forecast",
            "Activity",
          ].map((item) => (
            <button
              key={item}
              className={`sidebar-item ${
                activeSection === item ? "active" : ""
              }`}
              onClick={() => navigate(item)}
            >
              <span className="sidebar-icon">
                {item === "Overview" && "⌂"}
                {item === "Pipeline" && "◈"}
                {item === "AI Insights" && "✦"}
                {item === "Accounts" && "◎"}
                {item === "Performance" && "↗"}
                {item === "Forecast" && "◌"}
                {item === "Activity" && "◷"}
              </span>

              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="ai-status">
            <div className="status-dot" />

            <div>
              <strong>AI Engine Online</strong>
              <span>Decision system active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <div className="breadcrumb">REVENUE INTELLIGENCE</div>
            <h1>{activeSection}</h1>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities..."
              />
            </div>

            <div className="live-status">
              <i />
              LIVE
            </div>

            <div className="avatar">SR</div>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="error-banner">
            <strong>Connection issue:</strong> {error}
          </div>
        )}

        {/* =========================
            OVERVIEW
        ========================= */}
        {activeSection === "Overview" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">AI-POWERED REVENUE CONTROL</span>

                <h2>
                  Turn every opportunity
                  <br />
                  into your <em>next win.</em>
                </h2>

                <p>
                  RevenueRescue AI analyzes leads, accounts and deals to
                  identify where your team should focus next.
                </p>

                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() => navigate("Pipeline")}
                  >
                    View Pipeline
                    <span>→</span>
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => navigate("AI Insights")}
                  >
                    Explore AI Insights
                  </button>
                </div>
              </div>

              <div className="hero-visual">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />

                <div className="hero-core">
                  <span>AI</span>
                  <strong>80.5</strong>
                  <small>PRIORITY</small>
                </div>
              </div>
            </section>

            {/* METRICS */}
            <section className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">PIPELINE VALUE</span>

                <strong>
                  {loading
                    ? "..."
                    : formatCurrency(totalPipelineValue)}
                </strong>

                <span className="metric-foot">
                  Across active opportunities
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">OPPORTUNITIES</span>

                <strong>{loading ? "..." : pipeline.length}</strong>

                <span className="metric-foot">
                  Currently in pipeline
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">AVG. PROBABILITY</span>

                <strong>
                  {loading
                    ? "..."
                    : `${averageProbability.toFixed(0)}%`}
                </strong>

                <span className="metric-foot">
                  Weighted deal confidence
                </span>
              </div>

              <div className="metric-card accent-card">
                <span className="metric-label">HIGH PRIORITY</span>

                <strong>
                  {loading ? "..." : highPriorityCount}
                </strong>

                <span className="metric-foot">
                  Opportunities needing attention
                </span>
              </div>
            </section>

            {/* FEATURED OPPORTUNITY */}
            <section className="content-grid">
              <div className="panel featured-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">TOP OPPORTUNITY</span>
                    <h2>Highest priority deal</h2>
                  </div>

                  <span className="live-label">
                    <i />
                    AI PRIORITIZED
                  </span>
                </div>

                {loading ? (
                  <div className="loading-state">
                    Loading opportunity...
                  </div>
                ) : pipeline.length === 0 ? (
                  <div className="empty-state">
                    No opportunities available.
                  </div>
                ) : (
                  (() => {
                    const topOpportunity = [...pipeline].sort(
                      (a, b) =>
                        Number(b.priority_score || 0) -
                        Number(a.priority_score || 0)
                    )[0];

                    return (
                      <div
                        className="featured-opportunity"
                        onClick={() =>
                          setSelected(topOpportunity)
                        }
                      >
                        <div className="opportunity-main">
                          <div className="company-avatar">
                            {topOpportunity.company_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>{topOpportunity.company_name}</h3>

                            <p>
                              {topOpportunity.deal_name ||
                                "Open opportunity"}
                            </p>
                          </div>
                        </div>

                        <div className="opportunity-data">
                          <div>
                            <span>DEAL VALUE</span>
                            <strong>
                              {formatCurrency(
                                topOpportunity.deal_value
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>PROBABILITY</span>
                            <strong>
                              {Number(
                                topOpportunity.probability || 0
                              ).toFixed(0)}
                              %
                            </strong>
                          </div>

                          <div>
                            <span>AI SCORE</span>
                            <strong>
                              {Number(
                                topOpportunity.priority_score || 0
                              ).toFixed(1)}
                            </strong>
                          </div>

                          <div>
                            <span>PRIORITY</span>
                            <strong
                              className={getPriorityClass(
                                topOpportunity.priority_level
                              )}
                            >
                              {topOpportunity.priority_level ||
                                "—"}
                            </strong>
                          </div>
                        </div>

                        <div className="featured-action">
                          View details →
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="panel ai-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">AI DECISION</span>
                    <h2>Recommended action</h2>
                  </div>

                  <span className="ai-badge">✦ AI</span>
                </div>

                {loading ? (
                  <div className="loading-state">
                    Analyzing...
                  </div>
                ) : pipeline.length === 0 ? (
                  <div className="empty-state">
                    No AI recommendation available.
                  </div>
                ) : (
                  <>
                    <div className="ai-score">
                      <div className="score-ring">
                        <strong>
                          {Number(
                            pipeline[0].priority_score || 0
                          ).toFixed(1)}
                        </strong>
                        <span>SCORE</span>
                      </div>

                      <div>
                        <span className="eyebrow">
                          PRIORITY LEVEL
                        </span>

                        <h3>
                          {pipeline[0].ai_priority ||
                            pipeline[0].priority_level ||
                            "HIGH"}
                        </h3>
                      </div>
                    </div>

                    <p className="ai-recommendation">
                      {pipeline[0].ai_recommendation ||
                        pipeline[0].recommended_action ||
                        "Prioritize this opportunity and follow up with the decision-maker."}
                    </p>

                    <button
                      className="text-button"
                      onClick={() => setSelected(pipeline[0])}
                    >
                      See AI reasoning →
                    </button>
                  </>
                )}
              </div>
            </section>
          </>
        )}

        {/* =========================
            PIPELINE
        ========================= */}
        {activeSection === "Pipeline" && (
          <section
            className="panel opportunities"
            style={{ marginTop: "24px" }}
          >
            <div className="panel-heading pipeline-heading">
              <div>
                <span className="eyebrow">REVENUE PIPELINE</span>
                <h2>All opportunities</h2>
              </div>

              <div className="pipeline-controls">
                <span className="live-label">
                  <i />
                  {filteredPipeline.length} OPPORTUNITIES
                </span>

                <div className="pipeline-search">
                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search TechNova, Rahul, Proposal..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {search && (
                    <button
                      className="clear-search"
                      onClick={() => setSearch("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                Loading revenue pipeline...
              </div>
            ) : (
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
                      <div className="mini-avatar">
                        {item.company_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>{item.company_name}</strong>
                        <span>{item.lead_name}</span>
                      </div>
                    </div>

                    <span className="stage">
                      {item.deal_stage || "—"}
                    </span>

                    <strong>
                      {formatCurrency(item.deal_value)}
                    </strong>

                    <span>
                      {Number(item.probability || 0).toFixed(0)}%
                    </span>

                    <strong className="score">
                      {Number(item.priority_score || 0).toFixed(1)}
                    </strong>

                    <span
                      className={getPriorityClass(
                        item.priority_level
                      )}
                    >
                      {item.priority_level || "—"}
                    </span>
                  </button>
                ))}

                {!filteredPipeline.length && (
                  <div className="empty-table">
                    <div className="empty-icon">⌕</div>

                    <strong>
                      No matching opportunities found.
                    </strong>

                    <span>
                      Try searching for TechNova, Rahul, Proposal
                      or HIGH.
                    </span>

                    {search && (
                      <button
                        className="secondary-button"
                        onClick={() => setSearch("")}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* =========================
            AI INSIGHTS
        ========================= */}
        {activeSection === "AI Insights" && (
          <section className="insights-layout">
            <div className="panel ai-large-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">INTELLIGENCE LAYER</span>
                  <h2>AI Insights</h2>
                </div>

                <span className="ai-badge">✦ POWERED BY AI</span>
              </div>

              {pipeline.length > 0 ? (
                <>
                  <div className="insight-score">
                    <span>Current AI priority score</span>

                    <strong>
                      {Number(
                        pipeline[0].priority_score || 0
                      ).toFixed(1)}
                    </strong>
                  </div>

                  <div className="insight-block">
                    <span className="eyebrow">WHY THIS MATTERS</span>

                    <p>
                      {pipeline[0].priority_reason ||
                        "The opportunity combines strong engagement, deal value and probability."}
                    </p>
                  </div>

                  <div className="insight-block">
                    <span className="eyebrow">
                      RECOMMENDED NEXT ACTION
                    </span>

                    <p>
                      {pipeline[0].ai_recommendation ||
                        pipeline[0].recommended_action ||
                        "Follow up with the decision-maker and progress the deal."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  No AI insights available.
                </div>
              )}
            </div>
          </section>
        )}

        {/* =========================
            ACCOUNTS
        ========================= */}
        {activeSection === "Accounts" && (
          <section className="panel opportunities section-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">CUSTOMER INTELLIGENCE</span>
                <h2>Accounts</h2>
              </div>

              <span className="live-label">
                <i />
                {pipeline.length} ACCOUNTS
              </span>
            </div>

            <div className="account-grid">
              {pipeline.map((item) => (
                <button
                  className="account-card"
                  key={item.account_id || item.lead_id}
                  onClick={() => setSelected(item)}
                >
                  <div className="company-avatar">
                    {item.company_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>{item.company_name}</h3>

                    <p>
                      {item.industry || "Business"} ·{" "}
                      {item.location || "Location unavailable"}
                    </p>

                    <span>
                      {item.account_status || "Active"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* =========================
            PERFORMANCE
        ========================= */}
        {activeSection === "Performance" && (
          <section className="metrics-page">
            <div className="panel section-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">
                    REVENUE PERFORMANCE
                  </span>
                  <h2>Pipeline performance</h2>
                </div>
              </div>

              <div className="performance-grid">
                <div>
                  <span>PIPELINE VALUE</span>
                  <strong>
                    {formatCurrency(totalPipelineValue)}
                  </strong>
                </div>

                <div>
                  <span>AVERAGE PROBABILITY</span>
                  <strong>
                    {averageProbability.toFixed(0)}%
                  </strong>
                </div>

                <div>
                  <span>ACTIVE OPPORTUNITIES</span>
                  <strong>{pipeline.length}</strong>
                </div>

                <div>
                  <span>HIGH PRIORITY</span>
                  <strong>{highPriorityCount}</strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            FORECAST
        ========================= */}
        {activeSection === "Forecast" && (
          <section className="panel section-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">REVENUE OUTLOOK</span>
                <h2>Forecast</h2>
              </div>
            </div>

            <div className="forecast-box">
              <div>
                <span>EXPECTED PIPELINE</span>

                <strong>
                  {formatCurrency(
                    pipeline.reduce(
                      (sum, item) =>
                        sum +
                        Number(item.deal_value || 0) *
                          (Number(item.probability || 0) / 100),
                      0
                    )
                  )}
                </strong>
              </div>

              <p>
                Forecast value is calculated from deal value weighted
                by probability.
              </p>
            </div>
          </section>
        )}

        {/* =========================
            ACTIVITY
        ========================= */}
        {activeSection === "Activity" && (
          <section className="panel section-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">RECENT ACTIVITY</span>
                <h2>Revenue activity</h2>
              </div>
            </div>

            <div className="activity-list">
              {pipeline.map((item) => (
                <button
                  className="activity-item"
                  key={item.lead_id}
                  onClick={() => setSelected(item)}
                >
                  <div className="activity-dot" />

                  <div>
                    <strong>
                      {item.lead_name} · {item.company_name}
                    </strong>

                    <span>
                      Opportunity currently in{" "}
                      {item.deal_stage || "pipeline"}
                    </span>
                  </div>

                  <time>
                    {formatDate(item.last_contacted_at)}
                  </time>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* =========================
          OPPORTUNITY MODAL
      ========================= */}
      {selected && (
        <div
          className="modal-backdrop"
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

            <div className="modal-header">
              <div className="company-avatar large">
                {selected.company_name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <span className="eyebrow">
                  OPPORTUNITY DETAILS
                </span>

                <h2>{selected.company_name}</h2>

                <p>
                  {selected.deal_name || "Revenue opportunity"}
                </p>
              </div>
            </div>

            <div className="modal-stats">
              <div>
                <span>DEAL VALUE</span>
                <strong>
                  {formatCurrency(selected.deal_value)}
                </strong>
              </div>

              <div>
                <span>PROBABILITY</span>
                <strong>
                  {Number(selected.probability || 0).toFixed(0)}%
                </strong>
              </div>

              <div>
                <span>AI SCORE</span>
                <strong>
                  {Number(selected.priority_score || 0).toFixed(1)}
                </strong>
              </div>

              <div>
                <span>PRIORITY</span>
                <strong
                  className={getPriorityClass(
                    selected.priority_level
                  )}
                >
                  {selected.priority_level || "—"}
                </strong>
              </div>
            </div>

            <div className="modal-section">
              <span className="eyebrow">LEAD INFORMATION</span>

              <div className="detail-grid">
                <div>
                  <span>Lead</span>
                  <strong>{selected.lead_name}</strong>
                </div>

                <div>
                  <span>Lead score</span>
                  <strong>
                    {Number(selected.lead_score || 0).toFixed(1)}
                  </strong>
                </div>

                <div>
                  <span>Stage</span>
                  <strong>
                    {selected.deal_stage || "—"}
                  </strong>
                </div>

                <div>
                  <span>Industry</span>
                  <strong>
                    {selected.industry || "—"}
                  </strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {selected.location || "—"}
                  </strong>
                </div>

                <div>
                  <span>Expected close</span>
                  <strong>
                    {formatDate(selected.expected_close_date)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-section ai-reasoning">
              <div className="ai-section-title">
                <span className="ai-badge">✦ AI</span>
                <span className="eyebrow">AI REASONING</span>
              </div>

              <p>
                {selected.priority_reason ||
                  "High lead engagement combined with the current deal value and probability makes this opportunity important."}
              </p>

              <div className="recommendation-box">
                <span>RECOMMENDED ACTION</span>

                <strong>
                  {selected.ai_recommendation ||
                    selected.recommended_action ||
                    "Follow up with the decision-maker and progress the opportunity."}
                </strong>
              </div>
            </div>

            <button
              className="primary-button modal-button"
              onClick={() => setSelected(null)}
            >
              Close Opportunity
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;