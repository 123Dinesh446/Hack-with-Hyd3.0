import { useState } from "react";
import {
  Activity,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Search,
  ShieldCheck,
  Sparkles,
  Server,
  Zap
} from "lucide-react";
import "./App.css";

const API_URL = "https://memoryops-ai-backend.onrender.com";

function App() {
  const [service, setService] = useState("Payment API");
  const [error, setError] = useState("HTTP 500 Internal Server Error");
  const [logs, setLogs] = useState(
    "Database connection timeout after 30 seconds. Connection pool exhausted. Payment transaction request failed."
  );
  const [description, setDescription] = useState(
    "Customers are unable to complete payments."
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeIncident = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/incident/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service,
          error,
          logs,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setResult({
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const diagnosis = result?.diagnosis;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Brain size={24} />
          </div>

          <div>
            <h2>MemoryOps</h2>
            <span>AI Operations</span>
          </div>
        </div>

        <nav>
          <div className="nav-item active">
            <Activity size={18} />
            Incident Center
          </div>

          <div className="nav-item">
            <Brain size={18} />
            Memory
          </div>

          <div className="nav-item">
            <Clock3 size={18} />
            Incident History
          </div>

          <div className="nav-item">
            <ShieldCheck size={18} />
            Reliability
          </div>
        </nav>

        <div className="system-status">
          <div className="status-dot"></div>
          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">OPERATIONS COMMAND CENTER</p>
            <h1>Incident Response</h1>
            <p className="subtitle">
              AI that remembers how your systems failed before.
            </p>
          </div>

          <div className="top-status">
            <span className="live-dot"></span>
            Live
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon">
              <AlertTriangle size={19} />
            </div>
            <div>
              <span>Active Incidents</span>
              <strong>{result ? 1 : 0}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Brain size={19} />
            </div>
            <div>
              <span>Memories Recalled</span>
              <strong>{result?.memories_found ?? 0}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Zap size={19} />
            </div>
            <div>
              <span>AI Status</span>
              <strong>{loading ? "Thinking" : "Ready"}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Database size={19} />
            </div>
            <div>
              <span>Memory Engine</span>
              <strong>Hindsight</strong>
            </div>
          </div>
        </section>

        <div className="workspace">
          <section className="panel incident-panel">
            <div className="panel-heading">
              <div>
                <span className="section-label">NEW INCIDENT</span>
                <h2>Incident Details</h2>
              </div>

              <Server size={21} />
            </div>

            <label>Service</label>
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
            />

            <label>Error</label>
            <input
              value={error}
              onChange={(e) => setError(e.target.value)}
            />

            <label>Production Logs</label>
            <textarea
              rows="6"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
            />

            <label>Incident Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              className="analyze-button"
              onClick={analyzeIncident}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Sparkles size={18} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Incident
                </>
              )}
            </button>
          </section>

          <section className="right-column">
            <div className="panel diagnosis-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-label">AI DIAGNOSIS</span>
                  <h2>Root Cause Analysis</h2>
                </div>

                {diagnosis && (
                  <div className="confidence">
                    {diagnosis.confidence}% confidence
                  </div>
                )}
              </div>

              {!result && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Search size={25} />
                  </div>
                  <h3>Waiting for incident</h3>
                  <p>
                    Submit an incident to retrieve historical memory and
                    generate an AI diagnosis.
                  </p>
                </div>
              )}

              {loading && (
                <div className="empty-state">
                  <div className="loader">
                    <Sparkles size={26} />
                  </div>
                  <h3>Investigating incident...</h3>
                  <p>
                    Searching Hindsight memory and analyzing production
                    evidence.
                  </p>
                </div>
              )}

              {result?.error && (
                <div className="error-box">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Backend Error</strong>
                    <p>{result.error}</p>
                  </div>
                </div>
              )}

              {diagnosis && (
                <div className="diagnosis-content">
                  <div className="severity-row">
                    <div>
                      <span>Severity</span>
                      <strong
                        className={`severity ${diagnosis.severity?.toLowerCase()}`}
                      >
                        {diagnosis.severity}
                      </strong>
                    </div>

                    <div className="memory-badge">
                      <Brain size={17} />
                      {diagnosis.memory_used
                        ? "Memory Used"
                        : "New Pattern"}
                    </div>
                  </div>

                  <div className="analysis-block">
                    <span>SUMMARY</span>
                    <p>{diagnosis.summary}</p>
                  </div>

                  <div className="analysis-block root-cause">
                    <span>LIKELY ROOT CAUSE</span>
                    <p>{diagnosis.root_cause}</p>
                  </div>

                  <div className="fix-block">
                    <span>RECOMMENDED FIX</span>
                    <p>{diagnosis.recommended_fix}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="panel memory-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-label">HINDSIGHT MEMORY</span>
                  <h2>Operational Knowledge</h2>
                </div>

                <Brain size={21} />
              </div>

              {!result && (
                <div className="memory-empty">
                  <Database size={20} />
                  <span>No memory retrieved yet</span>
                </div>
              )}

              {result && (
                <>
                  <div className="memory-summary">
                    <div className="memory-number">
                      {result.memories_found}
                    </div>

                    <div>
                      <strong>Similar incidents found</strong>
                      <span>
                        Historical operational knowledge retrieved from
                        Hindsight.
                      </span>
                    </div>
                  </div>

                  <div className="memory-list">
                    {result.memories?.slice(0, 3).map((memory, index) => (
                      <div className="memory-item" key={index}>
                        <div className="memory-check">
                          <CheckCircle2 size={16} />
                        </div>

                        <div>
                          <strong>Historical Incident #{index + 1}</strong>
                          <p>
                            {memory.text?.slice(0, 180)}
                            {memory.text?.length > 180 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                    ))}

                    {result.memories_found === 0 && (
                      <div className="learning-card">
                        <Sparkles size={18} />
                        <div>
                          <strong>New operational knowledge created</strong>
                          <p>
                            This incident has been stored in Hindsight and can
                            help diagnose future incidents.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
