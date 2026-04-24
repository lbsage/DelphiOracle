'use client'
import { useState } from 'react'
import { Badge, Dot, Card, SLabel, Bar, Btn, MiniChart } from '@/components/ui'
import { C, SEED_LOG } from '@/lib/constants'
import type { LogStatus } from '@/lib/types'

type Filter = 'ALL' | LogStatus

const STATUS_COLOR: Record<LogStatus, string> = {
  COMMITTED: C.cyan,
  SIMULATED: C.purple,
  DISCARDED: C.red,
}

const STATUS_ICON: Record<LogStatus, string> = {
  COMMITTED: '◈',
  SIMULATED: '⬡',
  DISCARDED: '✕',
}

const FILTER_OPTS: Filter[] = ['ALL', 'COMMITTED', 'SIMULATED', 'DISCARDED']

const CAL_MONTHS = ['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR']
const CAL_HEIGHTS = [32, 48, 44, 66, 82, 90]

const BENCHMARKS = [
  { label: 'Logic Rate v4', color: C.cyan,   value: 72 },
  { label: 'Vector Core',   color: C.purple, value: 58 },
  { label: 'Entropy Map',   color: C.orange, value: 45 },
]

export default function DecisionLog() {
  const [filter, setFilter] = useState<Filter>('ALL')

  const items = filter === 'ALL'
    ? SEED_LOG
    : SEED_LOG.filter(e => e.status === filter)

  const probColor = (v: number) => v >= 70 ? C.green : v >= 40 ? C.amber : C.red

  return (
    <div style={{ display: 'flex', height: '100%', background: C.bg, color: C.text1, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>Decision Log</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
            <Dot color={C.green} pulse />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.text2 }}>
              DB_SYNC: ACTIVE [0x9212] · {SEED_LOG.length} DIRECTIVES
            </span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Btn primary>+ New Directive</Btn>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
          {/* Search mock */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: C.card2, border: `1px solid ${C.border}`,
            borderRadius: 4, padding: '6px 12px', flex: 1, maxWidth: 240,
          }}>
            <span style={{ color: C.text3, fontSize: 13 }}>⌕</span>
            <span style={{ color: C.text3, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>Search directives…</span>
          </div>
          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 4 }}>
            {FILTER_OPTS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? C.orange : 'transparent',
                  color: filter === f ? '#fff' : C.text2,
                  border: `1px solid ${filter === f ? C.orange : C.border2}`,
                  borderRadius: 4, padding: '5px 12px',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: "'Space Mono', monospace",
                  transition: 'all 0.12s',
                }}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Log entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(entry => {
            const sc = STATUS_COLOR[entry.status]
            const si = STATUS_ICON[entry.status]
            const impPositive = entry.impact_delta.startsWith('+')

            return (
              <Card key={entry.id} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                {/* Main body */}
                <div style={{ padding: '14px 16px 12px', position: 'relative' }}>
                  {/* Background icon */}
                  <span style={{
                    position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 52, color: sc, opacity: 0.2, lineHeight: 1, pointerEvents: 'none',
                    fontFamily: 'system-ui, sans-serif',
                  }}>{si}</span>

                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.text3, letterSpacing: '0.08em' }}>
                      {entry.ref}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: C.text1, lineHeight: 1.3 }}>
                      {entry.title}
                    </span>
                    <Badge color={sc}>{entry.status}</Badge>
                  </div>

                  {/* Description */}
                  <p style={{ margin: '0 0 12px', fontSize: 12, color: C.text2, lineHeight: 1.65, paddingRight: 60 }}>
                    {entry.description}
                  </p>

                  {/* Metrics row */}
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, marginBottom: 3, letterSpacing: '0.08em' }}>SUCCESS PROB</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: probColor(entry.success_prob) }}>{entry.success_prob}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, marginBottom: 3, letterSpacing: '0.08em' }}>IMPACT Δ</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: impPositive ? C.green : C.red }}>{entry.impact_delta}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: C.text3, marginBottom: 3, letterSpacing: '0.08em' }}>REVERSIBILITY</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.cyan }}>{entry.reversibility}%</div>
                    </div>
                  </div>
                </div>

                {/* Footer strip */}
                <div style={{
                  background: C.card2, borderTop: `1px solid ${C.border}`,
                  padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                }}>
                  {entry.tags.map(tag => (
                    <Badge key={tag} color={C.text3}>{tag}</Badge>
                  ))}
                  <a
                    href="#"
                    style={{ marginLeft: 'auto', fontSize: 10, color: C.orange, fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none' }}
                  >
                    DEEP ANALYSIS →
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div style={{
        width: 200, flexShrink: 0, overflowY: 'auto',
        borderLeft: `1px solid ${C.border}`,
        padding: '18px 14px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>

        {/* Calibration card */}
        <Card style={{ padding: 14 }}>
          <SLabel>Calibration</SLabel>
          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90, marginBottom: 6 }}>
            {CAL_HEIGHTS.map((h, i) => {
              const isLast = i === CAL_HEIGHTS.length - 1
              const barH = Math.round(h * 90 / 100)
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: barH,
                    background: isLast ? C.green : `${C.cyan}b3`,
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.4s ease',
                  }} />
                </div>
              )
            })}
          </div>
          {/* Month labels */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {CAL_MONTHS.map(m => (
              <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: C.text3, fontFamily: "'Space Mono', monospace" }}>{m}</div>
            ))}
          </div>
          {/* Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Model Confidence', value: '98.4%', color: C.green },
              { label: 'Mean Error Rate',  value: '0.021',  color: C.text1 },
              { label: 'Decisions Eval.',  value: '1,482',  color: C.text1 },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>{m.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Historical Context card */}
        <Card style={{ background: `${C.cyan}0a`, border: `1px solid ${C.cyan}30`, padding: 14 }}>
          <SLabel>Historical Context</SLabel>
          <p style={{ margin: '0 0 10px', fontSize: 11, color: C.text2, lineHeight: 1.6 }}>
            Archive spans 847 committed decisions across 38 months. Searchable by tag, outcome, and authority level.
          </p>
          <a href="#" style={{ fontSize: 10, color: C.orange, fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none' }}>
            DOWNLOAD ARCHIVE (JSON)
          </a>
        </Card>

        {/* Active Benchmarks card */}
        <Card style={{ padding: 14 }}>
          <SLabel>Active Benchmarks</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BENCHMARKS.map(b => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: C.text2 }}>{b.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: b.color, fontFamily: "'Space Mono', monospace" }}>{b.value}%</span>
                </div>
                <Bar value={b.value} color={b.color} h={3} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
