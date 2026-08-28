import { useMemo, useState } from 'react'
import './App.css'

type TraceStatus = 'completed' | 'review' | 'failed'

type Trace = {
  id: string
  title: string
  model: string
  latency: string
  tokens: string
  status: TraceStatus
  time: string
  steps: { name: string; detail: string; duration: string }[]
}

const traces: Trace[] = [
  {
    id: 'tr-1048',
    title: 'Refund policy question',
    model: 'gpt-4.1-mini',
    latency: '1.84s',
    tokens: '1,284',
    status: 'completed',
    time: '2 min ago',
    steps: [
      { name: 'Intent classification', detail: 'billing.refund', duration: '82ms' },
      { name: 'Knowledge retrieval', detail: '4 chunks / 0.91 relevance', duration: '421ms' },
      { name: 'Policy response', detail: 'grounded answer generated', duration: '1.21s' },
    ],
  },
  {
    id: 'tr-1047',
    title: 'Order status follow-up',
    model: 'gpt-4.1-mini',
    latency: '2.31s',
    tokens: '1,906',
    status: 'review',
    time: '6 min ago',
    steps: [
      { name: 'Intent classification', detail: 'delivery.status', duration: '74ms' },
      { name: 'Tool execution', detail: 'order lookup / partial result', duration: '684ms' },
      { name: 'Clarifying response', detail: 'handoff recommended', duration: '1.44s' },
    ],
  },
  {
    id: 'tr-1046',
    title: 'Account cancellation',
    model: 'gpt-4.1-mini',
    latency: '0.76s',
    tokens: '442',
    status: 'failed',
    time: '11 min ago',
    steps: [
      { name: 'Intent classification', detail: 'account.cancel', duration: '66ms' },
      { name: 'Account action', detail: 'permission denied', duration: '381ms' },
      { name: 'Recovery', detail: 'fallback unavailable', duration: '313ms' },
    ],
  },
]

function statusLabel(status: TraceStatus) {
  return status === 'completed' ? 'Passed' : status === 'review' ? 'Review' : 'Failed'
}

function App() {
  const [selectedId, setSelectedId] = useState(traces[0].id)
  const [onlyIssues, setOnlyIssues] = useState(false)
  const [isLive, setIsLive] = useState(true)

  const visibleTraces = useMemo(
    () => (onlyIssues ? traces.filter((trace) => trace.status !== 'completed') : traces),
    [onlyIssues],
  )
  const selectedTrace = traces.find((trace) => trace.id === selectedId) ?? traces[0]

  return (
    <main className="trace-app">
      <aside className="sidebar">
        <a className="trace-mark" href="#workspace" aria-label="TraceDeck workspace">
          <span>TD</span>
          <strong>TraceDeck</strong>
        </a>
        <nav aria-label="Workspace navigation">
          <a className="active" href="#workspace">Traces <span>24</span></a>
          <a href="#workspace">Eval sets</a>
          <a href="#workspace">Prompt registry</a>
          <a href="#workspace">Usage</a>
        </nav>
        <div className="sidebar-bottom">
          <p>PRODUCTION</p>
          <strong>support-agent-v4</strong>
          <span>Synced 12s ago</span>
        </div>
      </aside>

      <section className="workspace" id="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">OBSERVABILITY / SUPPORT AGENT</p>
            <h1>Trace explorer</h1>
          </div>
          <div className="top-actions">
            <button type="button" className="quiet-button" onClick={() => setOnlyIssues((value) => !value)}>
              {onlyIssues ? 'Show all traces' : 'Issues only'}
            </button>
            <button type="button" className="live-button" aria-pressed={isLive} onClick={() => setIsLive((value) => !value)}>
              <span /> {isLive ? 'Live stream' : 'Stream paused'}
            </button>
          </div>
        </header>

        <section className="metric-row" aria-label="Trace metrics">
          <article><span>Success rate</span><strong>96.8%</strong><small>+1.4% this week</small></article>
          <article><span>P95 latency</span><strong>2.31s</strong><small>Target under 2.5s</small></article>
          <article><span>Cost / resolution</span><strong>$0.014</strong><small>Within budget</small></article>
        </section>

        <section className="trace-layout">
          <div className="trace-list" aria-label="Recent agent traces">
            <div className="section-heading"><h2>Recent traces</h2><span>{visibleTraces.length} visible</span></div>
            {visibleTraces.map((trace) => (
              <button
                type="button"
                key={trace.id}
                className={`trace-item ${selectedTrace.id === trace.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(trace.id)}
              >
                <span className={`status-dot ${trace.status}`} />
                <span className="trace-item-copy"><strong>{trace.title}</strong><small>{trace.id} · {trace.time}</small></span>
                <span className="trace-latency">{trace.latency}</span>
              </button>
            ))}
          </div>

          <article className="trace-detail" aria-live="polite">
            <div className="detail-head">
              <div><p className="eyebrow">TRACE {selectedTrace.id}</p><h2>{selectedTrace.title}</h2></div>
              <span className={`status-badge ${selectedTrace.status}`}>{statusLabel(selectedTrace.status)}</span>
            </div>
            <div className="detail-meta"><span>{selectedTrace.model}</span><span>{selectedTrace.latency}</span><span>{selectedTrace.tokens} tokens</span></div>
            <div className="trace-steps">
              {selectedTrace.steps.map((step, index) => (
                <div className="step" key={step.name}>
                  <span className="step-index">0{index + 1}</span>
                  <div><strong>{step.name}</strong><p>{step.detail}</p></div>
                  <time>{step.duration}</time>
                </div>
              ))}
            </div>
            <div className="response-box"><span>MODEL RESPONSE</span><p>Your refund is eligible under the 30-day policy. I can start the request now, or share the expected processing time.</p></div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
