'use client'
import { Badge, Dot, Card, SLabel, Bar, Btn, MiniChart } from '@/components/ui'
import { C } from '@/lib/constants'

const DEBT_TRAJECTORY = [20, 22, 25, 28, 30, 35, 38, 42, 48, 55, 65, 78, 90]
const TRAJ_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN']

const DAM_DATA = [
  { decision: 'Budget Reallocation',  level: 'Executive', threshold: '>$500K',       status: 'ACTIVE',    auth: 9 },
  { decision: 'Market Entry',         level: 'Board',     threshold: 'New Region',   status: 'ACTIVE',    auth: 10 },
  { decision: 'Technical Architecture', level: 'CTO',    threshold: 'Core Infra',   status: 'DELEGATED', auth: 7 },
  { decision: 'Hiring >VP Level',     level: 'CEO',       threshold: '>L8',          status: 'ACTIVE',    auth: 9 },
  { decision: 'Partner Agreements',   level: 'Strategy',  threshold: '>$100K ARR',   status: 'ACTIVE',    auth: 6 },
  { decision: 'Product Roadmap Q+2',  level: 'CPO',       threshold: 'Major Features', status: 'DELEGATED', auth: 7 },
] as const

const DRIFT_ITEMS = [
  {
    color: C.red,
    title: 'Systemic Lock-In Detected',
    id: 'DRIFT-0041',
    desc: 'Three committed decisions in Q1 converge on a single vendor dependency. Exit pathway now constrained. Recommend authority review.',
  },
  {
    color: C.amber,
    title: 'Optionality Decay — Infra Layer',
    id: 'DRIFT-0039',
    desc: 'ARM migration commits have reduced reversibility from 88% to 42% over 60 days. Trajectory toward irreversibility threshold.',
  },
  {
    color: C.cyan,
    title: 'Authority Boundary Expansion',
    id: 'DRIFT-0037',
    desc: 'CTO-level decisions exceeding defined threshold in 2 of 4 recent commits. DAM calibration recommended before Q2 close.',
  },
]

// SVG circular gauge at 75%
function CircularGauge({ pct = 75 }: { pct?: number }) {
  const r = 44, cx = 56, cy = 56, stroke = 8
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const gap = circ - dash
  // Start from top (-90deg), so rotate -90
  return (
    <svg width={112} height={112} style={{ display: 'block', margin: '0 auto' }}>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      {/* Arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={C.cyan}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${gap}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
      {/* Center text */}
      <text x={cx} y={cy - 5} textAnchor="middle" fill={C.text1} fontSize={18} fontWeight={700} fontFamily="system-ui, sans-serif">{pct}%</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill={C.text3} fontSize={9} fontFamily="'Space Mono', monospace" letterSpacing="0.08em">CONFIDENCE</text>
    </svg>
  )
}

export default function Governance() {
  return (
    <div style={{ display: 'flex', height: '100%', background: C.bg, color: C.text1, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 4 }}>
            <div>
              <h2 style={{ margin: '0 0 3px', fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>Executive Mission Control</h2>
              <div style={{ fontSize: 11, color: C.text2 }}>Governance Layer · Portfolio &amp; Authority Management</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Btn>Export Report</Btn>
              <Btn primary>Initiate Recovery</Btn>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Current Debt Value</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, marginBottom: 4 }}>$142,500</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.red, fontFamily: "'Space Mono', monospace" }}>↑ 5.2%</span>
          </Card>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Debt-to-Equity Ratio</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: C.text1 }}>0.14</span>
              <Badge color={C.amber}>WARNING</Badge>
            </div>
            <span style={{ fontSize: 10, color: C.text3 }}>Approaching threshold</span>
          </Card>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Recovery Window</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>24 Days</div>
            <span style={{ fontSize: 10, color: C.text3 }}>Before lock-in threshold</span>
          </Card>
        </div>

        {/* Debt Trajectory chart */}
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <SLabel>Debt Trajectory</SLabel>
          <MiniChart points={DEBT_TRAJECTORY} color={C.cyan} fill height={100} />
          {/* Legend */}
          <div style={{ display: 'flex', gap: 18, marginTop: 10, marginBottom: 6 }}>
            {[
              { label: 'CALCULATED', color: C.cyan },
              { label: 'TARGET',     color: C.green },
              { label: 'RISK PROJ.', color: C.red },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 2, background: l.color, borderRadius: 1 }} />
                <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em' }}>{l.label}</span>
              </div>
            ))}
          </div>
          {/* Month labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {TRAJ_MONTHS.map((m, i) => (
              <span key={i} style={{ fontSize: 8, color: C.text3, fontFamily: "'Space Mono', monospace" }}>{m}</span>
            ))}
          </div>
        </Card>

        {/* Decision Authority Matrix */}
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <SLabel>Decision Authority Matrix</SLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
              <Dot color={C.green} pulse />
              <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>LIVE</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  {['Decision Type', 'Authority Level', 'Threshold', 'Status', 'Auth. Score'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left', padding: '6px 10px',
                      fontSize: 9, fontFamily: "'Space Mono', monospace", fontWeight: 700,
                      color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase',
                      borderBottom: `1px solid ${C.border}`,
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAM_DATA.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '9px 10px', color: C.text1, fontWeight: 500 }}>{row.decision}</td>
                    <td style={{ padding: '9px 10px', color: C.text2, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>{row.level}</td>
                    <td style={{ padding: '9px 10px', color: C.text2, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>{row.threshold}</td>
                    <td style={{ padding: '9px 10px' }}>
                      <Badge color={row.status === 'ACTIVE' ? C.green : C.amber}>{row.status}</Badge>
                    </td>
                    <td style={{ padding: '9px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bar value={row.auth * 10} color={row.auth >= 9 ? C.green : row.auth >= 7 ? C.cyan : C.amber} h={4} style={{ width: 60 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: C.text1, minWidth: 14 }}>{row.auth}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Drift Detection */}
        <Card style={{ padding: 14 }}>
          <SLabel>Drift Detection</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DRIFT_ITEMS.map(d => (
              <div key={d.id} style={{
                display: 'flex', gap: 0,
                background: C.card2, borderRadius: 4, overflow: 'hidden',
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ width: 3, background: d.color, flexShrink: 0 }} />
                <div style={{ padding: '10px 12px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>{d.title}</span>
                    <Badge color={d.color}>{d.id}</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: C.text2, lineHeight: 1.6 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        width: 200, flexShrink: 0,
        borderLeft: `1px solid ${C.border}`,
        padding: '18px 14px',
        display: 'flex', flexDirection: 'column', gap: 14,
        overflowY: 'auto',
      }}>

        {/* Confidence Score card */}
        <Card style={{ padding: 14 }}>
          <SLabel>Confidence Score</SLabel>
          <CircularGauge pct={75} />
          <p style={{ margin: '10px 0 0', fontSize: 11, color: C.text2, lineHeight: 1.6, textAlign: 'center' }}>
            Overall governance model confidence across active directives.
          </p>
        </Card>

        {/* Recent Events card */}
        <Card style={{ padding: 14 }}>
          <SLabel>Recent Events</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 4, padding: '9px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 14 }}>↗</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>Systemic Lock-In</span>
              </div>
              <span style={{ fontSize: 10, color: C.text3, fontFamily: "'Space Mono', monospace" }}>DETECTED · 14 MIN AGO</span>
            </div>
            <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 4, padding: '9px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 14 }}>⚠</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.amber }}>Optionality Decay</span>
              </div>
              <span style={{ fontSize: 10, color: C.text3, fontFamily: "'Space Mono', monospace" }}>FLAGGED · 2 HRS AGO</span>
            </div>
          </div>
        </Card>

        {/* Observer Perspective card */}
        <div style={{
          border: `1px dashed ${C.border2}`,
          borderRadius: 6, padding: 14,
          background: 'transparent',
        }}>
          <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.12em', marginBottom: 8, textTransform: 'uppercase' }}>Observer Perspective</div>
          <p style={{
            margin: 0, fontSize: 11, color: C.text2,
            lineHeight: 1.7, fontStyle: 'italic',
          }}>
            "The system is not optimizing for the best decision. It is optimizing for the decision that survives the most futures."
          </p>
          <div style={{ marginTop: 8, fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>— DELPHI S3 LAYER</div>
        </div>
      </div>
    </div>
  )
}
