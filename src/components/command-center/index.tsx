'use client'
import { useState } from 'react'
import { C } from '@/lib/constants'
import { Badge, Card, SLabel, Bar, Btn, MiniChart, Dot } from '@/components/ui'

const AGENTS_OMC = [
  { name: 'Planner', role: 'Scenario Architect', load: 78, status: 'ACTIVE', last: 'Generated 3 forward paths for DEC-091' },
  { name: 'Inversion', role: 'Failure Mode Analyst', load: 92, status: 'RUNNING', last: 'Cascade risk update: QUANTUM_ENTROPY' },
  { name: 'Counterfactual', role: 'What-If Reasoner', load: 61, status: 'ACTIVE', last: 'Completed sensitivity analysis on Path B' },
  { name: 'Exegesis', role: 'Context Reconstruction', load: 44, status: 'STANDBY', last: 'Awaiting new decision context' },
  { name: 'Judge', role: 'Multi-Objective Evaluator', load: 55, status: 'ACTIVE', last: 'Routing verdict issued: ACT for DEC-092' },
  { name: 'Meta', role: 'Calibration & Reflection', load: 38, status: 'STANDBY', last: 'S3 review cycle complete' },
]

const TASKS = [
  { label: 'Decision context decomposition', done: true },
  { label: 'Forward path generation (3 paths)', done: true },
  { label: 'Inversion analysis', done: false, prog: 65 },
  { label: 'Counterfactual stress testing', done: false },
  { label: 'Judge routing verdict', done: false },
]

const PORTFOLIO = [
  { ref: 'DEC-091', title: 'ARM-64 Migration', layer: 'OMC', routing: 'ESCALATE', risk: 88, rev: 42, status: 'REVIEW' },
  { ref: 'DEC-092', title: 'SE Asia Expansion', layer: 'EMC', routing: 'ACT', risk: 32, rev: 71, status: 'READY' },
  { ref: 'DEC-093', title: 'Series B Cap', layer: 'EMC', routing: 'ESCALATE', risk: 74, rev: 28, status: 'REVIEW' },
  { ref: 'DEC-094', title: 'VP Engineering Hire', layer: 'OMC', routing: 'DEFER', risk: 18, rev: 85, status: 'READY' },
  { ref: 'DEC-090', title: 'Q3 Hiring Plan', layer: 'GK', routing: 'DEFER', risk: 22, rev: 90, status: 'READY' },
]

const DEBTS = [
  { ref: 'DEB-011', label: 'ARM Migration Lock-In', severity: 'HIGH', amount: 45000 },
  { ref: 'DEB-012', label: 'Vendor API Exclusivity', severity: 'HIGH', amount: 38000 },
  { ref: 'DEB-013', label: 'Legacy Auth Dependency', severity: 'MEDIUM', amount: 29500 },
  { ref: 'DEB-014', label: 'Monolithic Data Layer', severity: 'MEDIUM', amount: 30000 },
]

type Tab = 'omc' | 'emc' | 'gk'

export default function CommandCenter() {
  const [tab, setTab] = useState<Tab>('omc')
  const [path, setPath] = useState('A')
  const [revFloor, setRevFloor] = useState(0.6)
  const [riskTol, setRiskTol] = useState(0.4)
  const [ethWeight, setEthWeight] = useState(0.7)
  const [guardrails, setGuardrails] = useState({ rev: 0.6, risk: 0.4, eth: 0.7, time: 0.5 })

  const tabColor: Record<Tab, string> = { omc: C.orange, emc: C.cyan, gk: C.purple }

  const simDecisions = Math.round(18 + revFloor * 8 - riskTol * 4)
  const simBlocked = Math.round(3 + (1 - revFloor) * 6)
  const simQuality = Math.round(68 + revFloor * 15 + ethWeight * 10 - riskTol * 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, background: C.card2, padding: '0 20px', gap: 0, flexShrink: 0 }}>
        {(['omc', 'emc', 'gk'] as Tab[]).map(t => {
          const labels: Record<Tab, string> = { omc: 'OMC · Operator', emc: 'EMC · Executive', gk: 'GK · Governance Kernel' }
          const active = tab === t
          return (
            <div key={t} onClick={() => setTab(t)} style={{
              padding: '12px 20px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
              fontFamily: "'Space Mono',monospace", letterSpacing: '0.06em',
              color: active ? tabColor[t] : C.text3,
              borderBottom: active ? `2px solid ${tabColor[t]}` : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.12s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? tabColor[t] : C.border2 }} />
              {labels[t]}
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {/* ── OMC ── */}
        {tab === 'omc' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', gap: 16 }}>
            {/* Left: agents + feed */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <SLabel>Agent Console</SLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                {AGENTS_OMC.map(a => (
                  <Card key={a.name} style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.cyan }}>{a.name}</span>
                      <Badge color={a.status === 'RUNNING' ? C.orange : a.status === 'ACTIVE' ? C.green : C.text3}>{a.status}</Badge>
                    </div>
                    <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>{a.role}</div>
                    <Bar value={a.load} color={a.load > 80 ? C.red : a.load > 60 ? C.amber : C.cyan} h={3} style={{ marginBottom: 5 }} />
                    <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.4 }}>{a.last}</div>
                  </Card>
                ))}
              </div>

              {/* Activity feed */}
              <SLabel>Activity Feed</SLabel>
              <Card style={{ marginBottom: 18 }}>
                {[{ id: 'EVT-019', msg: 'Meta agent completed S3 calibration review for DEC-091', c: C.orange, t: '2m ago' },
                  { id: 'EVT-018', msg: 'RISK ALERT: Inversion agent flagged cascade probability 38% — QUANTUM_ENTROPY', c: C.red, t: '8m ago' },
                  { id: 'EVT-017', msg: 'Constraint CLEARED: ARM latency within spec — continue Phase 1', c: C.green, t: '15m ago' },
                ].map(e => (
                  <div key={e.id} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.border}`, alignItems: 'flex-start' }}>
                    <div style={{ width: 3, background: e.c, borderRadius: 2, flexShrink: 0, alignSelf: 'stretch', minHeight: 20 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, color: C.text2 }}>{e.msg}</span>
                      <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginTop: 2 }}>{e.id} · {e.t}</div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Task decomposition */}
              <SLabel right={<span style={{ fontSize: 9, color: C.orange, fontFamily: "'Space Mono',monospace" }}>2/5 COMPLETE</span>}>Task Decomposition</SLabel>
              <Card>
                {TASKS.map((task, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: task.done ? C.green : task.prog ? C.orange : C.border2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, marginTop: 1, color: task.done ? C.bg : C.text1 }}>
                      {task.done ? '✓' : task.prog ? '⟳' : '·'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: task.done ? C.text3 : C.text1, textDecoration: task.done ? 'line-through' : 'none', marginBottom: task.prog ? 5 : 0 }}>{task.label}</div>
                      {task.prog && <Bar value={task.prog} color={C.orange} h={3} />}
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Right: scenario paths + WWCM */}
            <div style={{ width: 240, flexShrink: 0 }}>
              <SLabel>Decision Scenarios</SLabel>
              <Card style={{ marginBottom: 14 }}>
                <svg width="100%" height="140" viewBox="0 0 200 140">
                  <line x1="30" y1="70" x2="80" y2="70" stroke={C.border2} strokeWidth="1.5" />
                  {[['A', 20, C.green, 84], ['B', 70, C.cyan, 71], ['C', 120, C.orange, 62]].map(([label, y, color, conf]) => (
                    <g key={label as string} onClick={() => setPath(label as string)} style={{ cursor: 'pointer' }}>
                      <line x1="80" y1="70" x2="150" y2={y as number} stroke={path === label ? color as string : C.border2} strokeWidth={path === label ? 2 : 1} />
                      <circle cx="150" cy={y as number} r="18" fill={path === label ? `${color as string}22` : C.card2} stroke={path === label ? color as string : C.border2} strokeWidth="1.5" />
                      <text x="150" y={(y as number) - 4} textAnchor="middle" fill={path === label ? color as string : C.text3} fontSize="10" fontWeight="700">P{label as string}</text>
                      <text x="150" y={(y as number) + 8} textAnchor="middle" fill={path === label ? color as string : C.text3} fontSize="8" fontFamily="Space Mono">{conf as number}%</text>
                    </g>
                  ))}
                  <circle cx="30" cy="70" r="12" fill={`${C.orange}22`} stroke={C.orange} strokeWidth="1.5" />
                  <text x="30" y="74" textAnchor="middle" fill={C.orange} fontSize="8" fontFamily="Space Mono">NOW</text>
                </svg>
                <div style={{ fontSize: 10, color: C.text3, textAlign: 'center' }}>Path {path} selected · {path === 'A' ? 84 : path === 'B' ? 71 : 62}% confidence</div>
              </Card>

              <SLabel>WWCM Conditions</SLabel>
              <Card style={{ marginBottom: 14 }}>
                {['ARM cache miss rate exceeds 8% in any 30-min window', 'Finance module latency exceeds 340ms P99', 'Team load factor drops below 0.6 during migration'].map((cond, i) => (
                  <div key={i} style={{ padding: '9px 10px', background: C.card2, borderRadius: 4, marginBottom: 7, borderLeft: `2px solid ${C.orange}` }}>
                    <div style={{ fontSize: 9, color: C.orange, fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>CONDITION 0{i + 1}</div>
                    <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.5 }}>{cond}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* ── EMC ── */}
        {tab === 'emc' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <SLabel>Decision Portfolio</SLabel>
              <Card style={{ marginBottom: 18 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {['Decision', 'Layer', 'Routing', 'Risk', 'Rev.', 'Status'].map(h => (
                        <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 8, color: C.text3, fontFamily: "'Space Mono',monospace", fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PORTFOLIO.map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '9px 10px' }}>
                          <div style={{ fontSize: 8, color: C.text3, fontFamily: "'Space Mono',monospace" }}>{row.ref}</div>
                          <div style={{ fontWeight: 500 }}>{row.title}</div>
                        </td>
                        <td style={{ padding: '9px 10px' }}><Badge color={row.layer === 'GK' ? C.purple : row.layer === 'EMC' ? C.cyan : C.orange}>{row.layer}</Badge></td>
                        <td style={{ padding: '9px 10px' }}><Badge color={row.routing === 'ACT' ? C.green : row.routing === 'ESCALATE' ? C.red : C.text3}>{row.routing}</Badge></td>
                        <td style={{ padding: '9px 10px', width: 80 }}><Bar value={row.risk} color={row.risk > 60 ? C.red : row.risk > 30 ? C.amber : C.green} h={3} /></td>
                        <td style={{ padding: '9px 10px', color: row.rev > 60 ? C.green : C.amber, fontFamily: "'Space Mono',monospace", fontSize: 10 }}>{row.rev}%</td>
                        <td style={{ padding: '9px 10px' }}><Badge color={row.status === 'READY' ? C.green : C.amber}>{row.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* FAITH */}
              <SLabel>FAITH Dashboard</SLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                {[['High Confidence', 12, C.green], ['Fragile', 8, C.amber], ['Ethically Sensitive', 6, C.purple], ['Escalated', 2, C.red]].map(([label, count, color]) => (
                  <Card key={label as string} style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: color as string, lineHeight: 1 }}>{count as number}</div>
                    <div style={{ fontSize: 10, color: C.text3, marginTop: 4 }}>{label as string}</div>
                  </Card>
                ))}
              </div>

              {/* Drift alerts */}
              <SLabel>Drift & Alerts</SLabel>
              <Card>
                {[{ t: 'Budget Authority Creep', c: C.red, s: 'CRITICAL' }, { t: 'Policy Conflict — EU Data', c: C.amber, s: 'WARNING' }, { t: 'Decision Velocity Spike', c: C.orange, s: 'MONITOR' }, { t: 'Reversibility Debt Threshold', c: C.amber, s: 'WARNING' }].map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                    <div style={{ width: 3, background: d.c, borderRadius: 2, alignSelf: 'stretch', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 12, color: C.text2 }}>{d.t}</div>
                    <Badge color={d.c}>{d.s}</Badge>
                  </div>
                ))}
              </Card>
            </div>

            {/* Guardrails */}
            <div style={{ width: 220, flexShrink: 0 }}>
              <SLabel>Guardrails & Constraints</SLabel>
              <Card style={{ marginBottom: 14 }}>
                {[['Reversibility Floor', guardrails.rev, (v: number) => setGuardrails(g => ({ ...g, rev: v })), C.cyan],
                  ['Risk Tolerance', guardrails.risk, (v: number) => setGuardrails(g => ({ ...g, risk: v })), C.orange],
                  ['Ethical Weight', guardrails.eth, (v: number) => setGuardrails(g => ({ ...g, eth: v })), C.purple],
                  ['Time Cap', guardrails.time, (v: number) => setGuardrails(g => ({ ...g, time: v })), C.amber],
                ].map(([label, val, setter, color]) => (
                  <div key={label as string} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace" }}>{label as string}</span>
                      <span style={{ fontSize: 9, color: color as string, fontFamily: "'Space Mono',monospace" }}>{(val as number).toFixed(2)}</span>
                    </div>
                    <input type="range" min={0} max={1} step={0.01} value={val as number}
                      onChange={e => (setter as (v: number) => void)(parseFloat(e.target.value))}
                      style={{ width: '100%', color: color as string, accentColor: color as string }} />
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* ── GK ── */}
        {tab === 'gk' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                {/* Calibration */}
                <Card>
                  <SLabel right={<Badge color={C.purple}>S3 LAYER</Badge>}>Calibration — 30 Day</SLabel>
                  <MiniChart points={[68, 71, 74, 70, 78, 82, 79, 85, 88, 84, 90, 87, 92]} color={C.cyan} height={100} fill />
                </Card>

                {/* Bias detection */}
                <Card>
                  <SLabel right={<span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace" }}>THRESHOLD: 0.050</span>}>Bias Detection</SLabel>
                  {[['Recency', 41, C.amber], ['Anchoring', 28, C.cyan], ['Overconfidence', 37, C.orange], ['Framing', 19, C.green]].map(([label, v, c]) => (
                    <div key={label as string} style={{ marginBottom: 9 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: C.text2 }}>{label as string}</span>
                        <span style={{ fontSize: 9, color: c as string, fontFamily: "'Space Mono',monospace" }}>{v as number}</span>
                      </div>
                      <Bar value={(v as number) * 2} color={c as string} h={3} />
                    </div>
                  ))}
                </Card>
              </div>

              {/* Reversibility debts */}
              <SLabel right={<span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace" }}>4 ACTIVE · $142,500</span>}>Reversibility Debt Tracker</SLabel>
              <Card style={{ marginBottom: 18 }}>
                {DEBTS.map(d => (
                  <div key={d.ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 2 }}>{d.ref}</div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{d.label}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Badge color={d.severity === 'HIGH' ? C.red : C.amber}>{d.severity}</Badge>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text1, fontFamily: "'Space Mono',monospace" }}>${d.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Policy Simulation Lab */}
              <SLabel right={<Badge color={C.purple}>SIMULATION LAB</Badge>}>Policy Simulation</SLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Card>
                  {[['Reversibility Floor', revFloor, setRevFloor, C.cyan], ['Risk Tolerance', riskTol, setRiskTol, C.orange], ['Ethical Weight', ethWeight, setEthWeight, C.purple]].map(([label, val, setter, color]) => (
                    <div key={label as string} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace" }}>{label as string}</span>
                        <span style={{ fontSize: 9, color: color as string, fontFamily: "'Space Mono',monospace" }}>{(val as number).toFixed(2)}</span>
                      </div>
                      <input type="range" min={0} max={1} step={0.01} value={val as number}
                        onChange={e => (setter as React.Dispatch<React.SetStateAction<number>>)(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: color as string }} />
                    </div>
                  ))}
                </Card>
                <Card style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25` }}>
                  <div style={{ fontSize: 9, color: C.purple, fontFamily: "'Space Mono',monospace", marginBottom: 12 }}>SIMULATION OUTPUT</div>
                  {[['Decisions Affected', simDecisions, C.cyan], ['Paths Blocked', simBlocked, C.red], ['Projected Quality', `${simQuality}%`, C.green]].map(([label, val, c]) => (
                    <div key={label as string} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 3 }}>{label as string}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: c as string }}>{val}</div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
