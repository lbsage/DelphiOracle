'use client'
import { useState } from 'react'
import { Badge, Dot, Card, SLabel, Bar, Btn } from '@/components/ui'
import { C } from '@/lib/constants'

const ACTORS = [
  { icon: '◈', name: 'CTO — Technical Authority' },
  { icon: '◇', name: 'CFO — Budget Approval' },
  { icon: '⊕', name: 'VP Engineering — Execution' },
  { icon: '◎', name: 'Risk Committee — Oversight' },
]

const CONSTRAINTS = [
  'Q2 reporting window active',
  'Finance module freeze: 45 days',
  'Max downtime: 2h per migration',
]

const ASSUMPTIONS = [
  'ARM latency within 340ms P99',
  'Cache miss rate below 8%',
  'Rollback path validated',
]

const MILESTONES = [
  {
    label: 'Context & Decomposition',
    status: 'COMPLETE' as const,
    detail: 'ERP scope mapped. 142 modules catalogued, 18 flagged high-risk.',
    progress: 100,
  },
  {
    label: 'Scenario Simulation',
    status: 'IN PROGRESS' as const,
    detail: 'Running 3 migration paths. P1 confidence 87%, P2 at 71%.',
    progress: 75,
  },
  {
    label: 'Stress Test & Judge',
    status: 'PENDING' as const,
    detail: 'Awaiting simulation completion. Entropy threshold set at 0.38.',
    progress: 0,
  },
]

const MILESTONE_COLOR: Record<string, string> = {
  'COMPLETE': C.green,
  'IN PROGRESS': C.orange,
  'PENDING': C.text3,
}

const MILESTONE_BADGE_COLOR: Record<string, string> = {
  'COMPLETE': C.green,
  'IN PROGRESS': C.amber,
  'PENDING': C.text3,
}

const BREADCRUMB = ['SENSE', 'FRAME', 'SIMULATE', 'STRESS', 'JUDGE']

export default function DecisionTheater() {
  const [stress, setStress] = useState(0.45)
  const [curv, setCurv] = useState(0.15)
  const [viab, setViab] = useState(0.72)
  const [entropy, setEntropy] = useState(0.38)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(84)

  function runSim() {
    setRunning(true)
    setDone(false)
    setTimeout(() => {
      setRunning(false)
      setDone(true)
      setScore(Math.round((viab * 100 * 0.6) + ((1 - stress) * 100 * 0.4)))
    }, 2000)
  }

  function resetSim() {
    setRunning(false)
    setDone(false)
    setStress(0.45)
    setCurv(0.15)
    setViab(0.72)
    setEntropy(0.38)
    setScore(84)
  }

  return (
    <div style={{ display: 'flex', gap: 0, height: '100vh', background: C.bg, overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT COLUMN ── */}
      <div style={{ width: 270, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.text1, fontFamily: "'Space Mono', monospace" }}>
            Context Capture
          </span>
          <Badge color={C.green}>LOCKED</Badge>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Primary Task */}
          <Card>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.text3, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>
              Primary Task
            </div>
            <p style={{ fontSize: 12, color: C.text1, lineHeight: 1.6, margin: 0 }}>
              Migrate legacy ERP system to ARM-64 cloud infrastructure while maintaining zero-downtime SLA during Q2 financial reporting window.
            </p>
          </Card>

          {/* Key Actors */}
          <Card>
            <SLabel>Key Actors</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ACTORS.map(({ icon, name }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 13, color: C.cyan }}>{icon}</span>
                  <span style={{ fontSize: 11, color: C.text2, lineHeight: 1.3 }}>{name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Constraints + Assumptions 2-col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Card style={{ padding: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.red, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>
                Constraints
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CONSTRAINTS.map(c => (
                  <div key={c} style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                    <span style={{ color: C.red, fontSize: 11, flexShrink: 0 }}>!</span>
                    <span style={{ fontSize: 10, color: C.text2, lineHeight: 1.4 }}>{c}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ padding: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>
                Assumptions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ASSUMPTIONS.map(a => (
                  <div key={a} style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                    <span style={{ color: C.green, fontSize: 11, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 10, color: C.text2, lineHeight: 1.4 }}>{a}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Exegesis Notes */}
          <Card style={{ borderLeft: `3px solid ${C.orange}44` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.orange, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>
              Exegesis Notes
            </div>
            <p style={{ fontSize: 11, color: C.text2, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              &ldquo;Critical timing dependency detected in finance module. Migration during Q2 window carries state corruption risk. Phased approach recommended with rollback checkpoints.&rdquo;
            </p>
          </Card>
        </div>
      </div>

      {/* ── CENTER COLUMN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, marginBottom: 8 }}>Decision Theater</div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {BREADCRUMB.map((step, i) => (
                <span key={step} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    fontFamily: "'Space Mono', monospace",
                    color: step === 'SIMULATE' ? C.orange : C.text3,
                    background: step === 'SIMULATE' ? `${C.orange}18` : 'transparent',
                    padding: step === 'SIMULATE' ? '2px 7px' : '2px 4px',
                    borderRadius: 3,
                    border: step === 'SIMULATE' ? `1px solid ${C.orange}44` : 'none',
                  }}>
                    {step}
                  </span>
                  {i < BREADCRUMB.length - 1 && (
                    <span style={{ fontSize: 9, color: C.text3, margin: '0 3px' }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {done && <Badge color={C.green}>COMPLETE</Badge>}
            <Btn
              primary={!running}
              onClick={!running ? runSim : undefined}
              disabled={running}
            >
              {running ? '⟳ RUNNING...' : 'SIMULATE'}
            </Btn>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* AI Decomposition Progress */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text3, fontFamily: "'Space Mono', monospace" }}>
                AI Decomposition Progress
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.orange, fontFamily: "'Space Mono', monospace" }}>75%</span>
            </div>
            <Bar value={75} color={C.orange} h={6} />
          </Card>

          {/* Milestones */}
          <Card>
            <SLabel>Milestones</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Circle */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: `${MILESTONE_COLOR[m.status]}22`,
                    border: `2px solid ${MILESTONE_COLOR[m.status]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                  }}>
                    {m.status === 'COMPLETE' && <span style={{ fontSize: 9, color: MILESTONE_COLOR[m.status] }}>✓</span>}
                    {m.status === 'IN PROGRESS' && <span style={{ fontSize: 9, color: MILESTONE_COLOR[m.status] }}>◈</span>}
                    {m.status === 'PENDING' && <span style={{ fontSize: 9, color: MILESTONE_COLOR[m.status] }}>○</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>{m.label}</span>
                      <Badge color={MILESTONE_BADGE_COLOR[m.status]}>{m.status}</Badge>
                    </div>
                    <p style={{ fontSize: 11, color: C.text2, lineHeight: 1.5, margin: '0 0 6px' }}>{m.detail}</p>
                    {m.status !== 'PENDING' && (
                      <Bar value={m.progress} color={MILESTONE_COLOR[m.status]} h={3} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Path */}
          <Card style={{ background: `${C.cyan}0a`, borderColor: `${C.cyan}44` }}>
            <SLabel right={<Badge color={C.cyan}>RECOMMENDED</Badge>}>Simulation Paths</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'P1', label: 'Phased ARM Migration with Rollback Gates', confidence: 87, color: C.cyan },
                { id: 'P2', label: 'Parallel Run — Hybrid ARM/x86 (60-day transition)', confidence: 71, color: C.purple },
              ].map(({ id, label, confidence, color }) => (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: C.card2,
                  borderRadius: 5,
                  border: `1px solid ${id === 'P1' ? `${C.cyan}44` : C.border}`,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{id}</span>
                  <span style={{ fontSize: 11, color: C.text1, flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{confidence}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{ width: 220, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* What-If Controls */}
        <Card>
          <SLabel>What-If Controls</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'STRESS LEVEL', value: stress, setter: setStress, color: C.orange },
              { label: 'CURVATURE DELTA', value: curv, setter: setCurv, color: C.purple },
              { label: 'VIABILITY INDEX', value: viab, setter: setViab, color: C.cyan },
              { label: 'ENTROPY THRESHOLD', value: entropy, setter: setEntropy, color: C.amber },
            ].map(({ label, value, setter, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text3, fontFamily: "'Space Mono', monospace" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>
                    {value.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={value}
                  onChange={e => setter(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: color,
                    height: 4,
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Sim Buttons */}
        <Btn primary full onClick={runSim} disabled={running}>
          {running ? '⟳ Running...' : 'SIMULATE'}
        </Btn>
        <Btn full onClick={resetSim}>RESET</Btn>

        {/* Top Signals */}
        <Card>
          <SLabel>Top Signals</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              padding: '8px 10px',
              background: `${C.green}0e`,
              border: `1px solid ${C.green}33`,
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 2 }}>Latency Surplus</div>
                <div style={{ fontSize: 9, color: C.text3 }}>P99 below threshold</div>
              </div>
              <span style={{ fontSize: 14, color: C.green }}>↗</span>
            </div>
            <div style={{
              padding: '8px 10px',
              background: `${C.amber}0e`,
              border: `1px solid ${C.amber}33`,
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, marginBottom: 2 }}>Team Saturation</div>
                <div style={{ fontSize: 9, color: C.text3 }}>82% — watch closely</div>
              </div>
              <span style={{ fontSize: 14, color: C.amber }}>⚠</span>
            </div>
          </div>
        </Card>

        {/* Overall Score */}
        <Card style={{ textAlign: 'center' }}>
          <SLabel>Overall Score</SLabel>
          <div style={{
            fontSize: 34,
            fontWeight: 700,
            color: C.orange,
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
            marginBottom: 6,
          }}>
            {score}
          </div>
          <p style={{ fontSize: 10, color: C.text2, lineHeight: 1.5, margin: '0 0 12px' }}>
            Composite viability score across all simulation paths and stress scenarios.
          </p>
          <Btn full sm onClick={() => {}}>Generate Report</Btn>
        </Card>
      </div>
    </div>
  )
}
