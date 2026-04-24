'use client'
import { useState } from 'react'
import { Badge, Dot, Card, SLabel, Bar, Btn, MiniChart } from '@/components/ui'
import { C } from '@/lib/constants'

type Layer = 'S1' | 'S2' | 'S3'

const CHART_PTS = [22, 28, 35, 31, 42, 38, 51, 47, 60, 68, 74, 82, 89]

const REASONING_SEQUENCES = [
  {
    id: 'SEQ-0041',
    title: 'ARM Migration Failure Mode Tree',
    ago: '14 min ago',
    desc: 'S2 inversion layer mapped 12 distinct failure modes. Primary node: cache coherence under load variance.',
    tags: ['INVERSION', 'FAILURE TREE'],
  },
  {
    id: 'SEQ-0039',
    title: 'SE Asia Market Entry Analogues',
    ago: '2 hrs ago',
    desc: 'Historical analogy matching: 6 comparable market entry events identified. Base rate: 67% success within 18mo.',
    tags: ['ANALOGY', 'BASE RATE'],
  },
  {
    id: 'SEQ-0037',
    title: 'Series B Valuation Sensitivity',
    ago: '6 hrs ago',
    desc: 'Monte Carlo sweep across 3 cap scenarios. Path B dominates at 7.8 option value across all compression levels.',
    tags: ['MONTE CARLO', 'SIMULATION'],
  },
]

const AAR_CARDS = [
  {
    title: 'Marketing Pivot',
    subtitle: 'S1 Error',
    status: 'DUE IN 2D',
    statusColor: C.amber,
    desc: 'Confidence exceeded accuracy by 18 points. Anchoring bias detected. Review S1 inputs and calibrate prior weighting.',
    owner: 'SARAH JENKINS',
  },
  {
    title: 'API Pricing Tier Launch',
    subtitle: '',
    status: 'REVIEW NEEDED',
    statusColor: C.green,
    desc: 'Outcome aligned within 4% of forecast. Minor variance in enterprise tier adoption. Model performed well overall.',
    owner: 'MICHAEL CHEN',
  },
  {
    title: 'New Region Expansion',
    subtitle: '',
    status: 'WAITING DATA',
    statusColor: C.text3,
    desc: 'Q4 regional telemetry incomplete. AAR blocked pending partner data sync. Estimated completion: +12 days.',
    owner: 'ELENA RODRIGUEZ',
  },
]

const NAV_ITEMS = [
  { id: 'log',    label: 'Decision Log',   active: true },
  { id: 'port',   label: 'Portfolio Review', active: false },
  { id: 'cal',    label: 'Calibration',    active: false },
  { id: 'robust', label: 'Robustness',     active: false },
]

export default function Intelligence() {
  const [layer, setLayer] = useState<Layer>('S2')

  return (
    <div style={{ display: 'flex', height: '100%', background: C.bg, color: C.text1, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Left sub-nav ── */}
      <div style={{
        width: 160, flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        padding: '18px 14px',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: C.text3, fontFamily: "'Space Mono', monospace", marginBottom: 10, textTransform: 'uppercase' }}>
          Monitoring
        </div>
        {NAV_ITEMS.map(n => (
          <div
            key={n.id}
            style={{
              padding: '7px 10px', borderRadius: 4, cursor: 'pointer',
              fontSize: 12, fontWeight: n.active ? 600 : 400,
              color: n.active ? C.orange : C.text2,
              background: n.active ? `${C.orange}15` : 'transparent',
              borderLeft: `2px solid ${n.active ? C.orange : 'transparent'}`,
              transition: 'all 0.12s',
            }}
          >{n.label}</div>
        ))}

        {/* System Health card */}
        <div style={{
          marginTop: 'auto',
          background: C.card2, border: `1px solid ${C.border}`,
          borderRadius: 6, padding: 12,
        }}>
          <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.1em', marginBottom: 6 }}>SYSTEM HEALTH</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.green, lineHeight: 1 }}>98.4%</div>
          <div style={{ fontSize: 10, color: C.text2, marginTop: 4 }}>+1.2% this cycle</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>Intelligence Layer</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 0, border: `1px solid ${C.border2}`, borderRadius: 4, overflow: 'hidden' }}>
            {(['S1', 'S2', 'S3'] as Layer[]).map(l => (
              <button
                key={l}
                onClick={() => setLayer(l)}
                style={{
                  background: layer === l ? C.orange : 'transparent',
                  color: layer === l ? '#fff' : C.text2,
                  border: 'none',
                  borderRight: l !== 'S3' ? `1px solid ${C.border2}` : 'none',
                  padding: '6px 16px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  cursor: 'pointer', fontFamily: "'Space Mono', monospace",
                  transition: 'all 0.12s',
                }}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* KPI cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
          {[
            {
              label: 'Reversibility Debt',
              value: '$42,500',
              change: '↑ 5.2%',
              changeColor: C.red,
              note: 'High leverage, low exit decisions',
            },
            {
              label: 'Calibration Error',
              value: '0.12',
              change: '↓ 2.1%',
              changeColor: C.green,
              note: 'Gap: confidence vs accuracy',
            },
            {
              label: 'Robustness Gain',
              value: '+18.4%',
              change: '↑ 4.0%',
              changeColor: C.green,
              note: 'Outcome invariance to S1 noise',
            },
          ].map(kpi => (
            <Card key={kpi.label} style={{ padding: 14 }}>
              <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>{kpi.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text1, marginBottom: 4 }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: kpi.changeColor, fontFamily: "'Space Mono', monospace" }}>{kpi.change}</span>
                <span style={{ fontSize: 10, color: C.text3 }}>{kpi.note}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* 2-col charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>

          {/* Calibration Curves */}
          <Card style={{ padding: 14 }}>
            <SLabel>Calibration Curves</SLabel>
            <div style={{ position: 'relative' }}>
              <MiniChart points={CHART_PTS} color={C.orange} height={120} fill />
              {/* Dashed diagonal reference line overlay */}
              <svg
                width="100%" height={120}
                viewBox="0 0 220 120"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              >
                <line x1="4" y1="116" x2="216" y2="4" stroke={C.text3} strokeWidth="1" strokeDasharray="4 3" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>Conf: 0%</span>
              <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>Conf: 100%</span>
            </div>
          </Card>

          {/* Reasoning Sequences */}
          <Card style={{ padding: 14 }}>
            <SLabel>Reasoning Sequences</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {REASONING_SEQUENCES.map(seq => (
                <div key={seq.id} style={{ paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: C.orange }}>{seq.id} · {seq.title}</span>
                    <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>{seq.ago}</span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 11, color: C.text2, lineHeight: 1.55 }}>{seq.desc}</p>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {seq.tags.map(t => <Badge key={t} color={C.text3}>{t}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AAR section header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>After-Action Reviews</span>
          <a href="#" style={{ marginLeft: 'auto', fontSize: 10, color: C.orange, fontFamily: "'Space Mono', monospace", fontWeight: 700, textDecoration: 'none' }}>View All →</a>
        </div>

        {/* AAR cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {AAR_CARDS.map(aar => (
            <Card key={aar.title} style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid ${aar.statusColor}` }}>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text1, lineHeight: 1.3 }}>{aar.title}</div>
                    {aar.subtitle && <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>{aar.subtitle}</div>}
                  </div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                    color: aar.statusColor, letterSpacing: '0.08em',
                  }}>{aar.status}</span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: 11, color: C.text2, lineHeight: 1.6 }}>{aar.desc}</p>
                <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, letterSpacing: '0.08em' }}>
                  OWNER: <span style={{ color: C.text2 }}>{aar.owner}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
