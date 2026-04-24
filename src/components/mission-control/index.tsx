'use client'
import { useState, useEffect } from 'react'
import { Badge, Dot, Card, SLabel, Bar, Btn, MiniChart, RouteBadge } from '@/components/ui'
import { C, SEED_DECISIONS } from '@/lib/constants'
import type { Decision } from '@/lib/types'

const CHIPS = ['SENSE', 'FRAME', 'SIM', 'STRESS', 'JUDGE', 'ACT', 'OBSERVE', 'UPDATE']
const TABS = ['forward', 'inverse', 'exegesis', 'counterfactual', 'aar'] as const
type Tab = typeof TABS[number]

const sorted = [...SEED_DECISIONS].sort((a, b) => b.gravity - a.gravity)

export default function MissionControl() {
  const [sel, setSel] = useState<Decision>(sorted[0])
  const [tab, setTab] = useState<Tab>('forward')
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPulse(p => (p + 1) % 8), 1800)
    return () => clearInterval(id)
  }, [])

  const routingBg: Record<string, string> = {
    ACT: `${C.green}18`,
    ESCALATE: `${C.red}18`,
    DEFER: `${C.text3}18`,
  }
  const routingBorder: Record<string, string> = {
    ACT: C.green,
    ESCALATE: C.red,
    DEFER: C.text3,
  }
  const routingLabel: Record<string, string> = {
    ACT: 'ACT NOW',
    ESCALATE: 'ESCALATE ↑',
    DEFER: 'DEFER',
  }
  const routingDesc: Record<string, string> = {
    ACT: 'Authority sufficient. Execute with confidence.',
    ESCALATE: 'Beyond current authority threshold. Requires escalation.',
    DEFER: 'No urgency trigger. Batch with next review cycle.',
  }

  return (
    <div style={{ display: 'flex', gap: 0, height: '100vh', background: C.bg, overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT COLUMN ── */}
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Attention Engine Header */}
        <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.text1, fontFamily: "'Space Mono', monospace" }}>Attention Engine</span>
            <Dot color={C.orange} pulse />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {CHIPS.map((chip, i) => {
              const isActive = i === pulse
              const isPrev = i === (pulse - 1 + 8) % 8
              return (
                <span
                  key={chip}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 3,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    fontFamily: "'Space Mono', monospace",
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    background: isActive ? `${C.orange}22` : isPrev ? `${C.cyan}12` : `${C.border}44`,
                    color: isActive ? C.orange : isPrev ? C.cyan : C.text3,
                    border: `1px solid ${isActive ? C.orange + '66' : isPrev ? C.cyan + '44' : C.border}`,
                  }}
                >
                  {chip}
                </span>
              )
            })}
          </div>
        </div>

        {/* Decision Gravity Feed */}
        <div style={{ flex: 1, overflow: 'auto', padding: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text3, fontFamily: "'Space Mono', monospace", marginBottom: 8, paddingLeft: 4 }}>
            Decision Gravity Feed
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sorted.map(d => {
              const isSelected = d.id === sel.id
              return (
                <div
                  key={d.id}
                  onClick={() => { setSel(d); setTab('forward') }}
                  style={{
                    background: isSelected ? C.card2 : C.card,
                    border: `1px solid ${isSelected ? C.border2 : C.border}`,
                    borderRadius: 6,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 8, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em' }}>{d.id}</span>
                    <RouteBadge r={d.routing} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text1, marginBottom: 8, lineHeight: 1.3 }}>{d.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bar value={d.gravity * 10} color={C.orange} h={3} style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.orange, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{d.gravity}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── CENTER COLUMN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Decision Header */}
        <div style={{ padding: '14px 18px 0', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em' }}>{sel.ref}</span>
                <Badge color={sel.status === 'CRITICAL' ? C.red : sel.status === 'ACTIVE' ? C.green : sel.status === 'PENDING' ? C.amber : C.text3}>
                  {sel.status}
                </Badge>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text1, marginBottom: 8 }}>{sel.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingBottom: 12 }}>
                <RouteBadge r={sel.routing} />
                {sel.tags.map(t => <Badge key={t} color={C.text2}>{t}</Badge>)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 4 }}>
              <Btn sm>Simulate</Btn>
              <Btn sm primary>Execute</Btn>
            </div>
          </div>

          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t ? C.orange : 'transparent'}`,
                  padding: '7px 14px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: tab === t ? C.orange : C.text3,
                  cursor: 'pointer',
                  fontFamily: "'Space Mono', monospace",
                  transition: 'all 0.12s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>

          {/* FORWARD TAB */}
          {tab === 'forward' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Forward Path */}
              <Card>
                <SLabel>Forward Path</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sel.path.map((step, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ fontSize: 9, color: C.cyan, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 12, color: C.text1, lineHeight: 1.4 }}>{step}</span>
                      </div>
                      <Bar value={90 - i * 12} color={C.cyan} h={3} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Right: Coupling + Inverse Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Card>
                  <SLabel>Coupling Analysis</SLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Spatial Progress', val: 82, color: C.green },
                      { label: 'Temporal', val: 64, color: C.amber },
                      { label: 'Resource', val: 71, color: C.cyan },
                    ].map(({ label, val, color }) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: C.text2 }}>{label}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{val}%</span>
                        </div>
                        <Bar value={val} color={color} h={3} />
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{ borderLeft: `3px solid ${C.red}44`, background: `${C.red}08` }}>
                  <SLabel>Inverse Preview</SLabel>
                  <p style={{ fontSize: 11, color: C.text2, lineHeight: 1.5, margin: 0 }}>
                    {sel.inverse.slice(0, 80)}…
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* INVERSE TAB */}
          {tab === 'inverse' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  { label: 'Risk Exposure', val: '34%', color: C.red },
                  { label: 'Cascade', val: '12%', color: C.amber },
                  { label: 'Recovery', val: '72h', color: C.cyan },
                ].map(({ label, val, color }) => (
                  <Card key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{val}</div>
                  </Card>
                ))}
              </div>
              <Card style={{ borderLeft: `3px solid ${C.red}`, background: `${C.red}0a` }}>
                <SLabel>Failure Modes</SLabel>
                <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.6, margin: 0 }}>{sel.inverse}</p>
              </Card>
            </div>
          )}

          {/* EXEGESIS TAB */}
          {tab === 'exegesis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Card style={{ borderLeft: `3px solid ${C.orange}` }}>
                <p style={{ fontSize: 13, color: C.text1, lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                  &ldquo;{sel.exegesis}&rdquo;
                </p>
              </Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Card>
                  <SLabel>Key Actors</SLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Primary Stakeholder', 'Technical Lead', 'Risk Officer', 'Board Sponsor'].map(actor => (
                      <div key={actor} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Dot color={C.cyan} />
                        <span style={{ fontSize: 11, color: C.text2 }}>{actor}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <SLabel>Verified Assumptions</SLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Market conditions stable', 'Regulatory approval granted', 'Team bandwidth sufficient', 'Budget committed'].map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: C.green, fontSize: 12 }}>✓</span>
                        <span style={{ fontSize: 11, color: C.text2 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* COUNTERFACTUAL TAB */}
          {tab === 'counterfactual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sel.conditions.map((cond, i) => (
                <Card
                  key={i}
                  style={{
                    borderLeft: `3px solid ${i % 2 === 0 ? C.orange : C.purple}`,
                    background: i % 2 === 0 ? `${C.orange}08` : `${C.purple}08`,
                  }}
                >
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: i % 2 === 0 ? C.orange : C.purple, fontFamily: "'Space Mono', monospace", marginBottom: 8, textTransform: 'uppercase' }}>
                    Condition {String(i + 1).padStart(2, '0')}
                  </div>
                  <p style={{ fontSize: 12, color: C.text1, lineHeight: 1.6, margin: 0 }}>{cond}</p>
                </Card>
              ))}
            </div>
          )}

          {/* AAR TAB */}
          {tab === 'aar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(sel.routing === 'DEFER' || sel.status === 'QUEUED') ? (
                <Card style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 12, color: C.text3 }}>⟳</div>
                  <div style={{ fontSize: 12, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em' }}>
                    After-Action Review not yet available
                  </div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 6 }}>Decision pending execution</div>
                </Card>
              ) : (
                <>
                  {/* Metrics row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {[
                      { label: 'Predicted', val: `${sel.confidence}%`, color: C.cyan },
                      { label: 'Actual Outcome', val: `${Math.round(sel.confidence * 0.96)}%`, color: C.green },
                      { label: 'Calibration Δ', val: `-${(100 - sel.confidence * 0.96 * 100 / sel.confidence).toFixed(1)}%`, color: C.amber },
                    ].map(({ label, val, color }) => (
                      <Card key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{val}</div>
                      </Card>
                    ))}
                  </div>

                  {/* Prediction vs Actual SVG chart */}
                  <Card>
                    <SLabel>Prediction vs Actual</SLabel>
                    <div style={{ position: 'relative', height: 90 }}>
                      <svg width="100%" height="90" viewBox="0 0 400 90" preserveAspectRatio="none">
                        {/* Dashed cyan predicted band */}
                        <path d="M0,35 Q100,30 200,38 T400,33" fill="none" stroke={C.cyan} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
                        <path d="M0,45 Q100,40 200,48 T400,43" fill="none" stroke={C.cyan} strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                        {/* Solid green actual line */}
                        <path d="M0,42 Q80,38 160,50 T320,36 T400,40" fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round" />
                        {/* NOW marker */}
                        <line x1="280" y1="5" x2="280" y2="85" stroke={C.text3} strokeWidth="1" strokeDasharray="4,2" />
                        <text x="283" y="12" fontSize="7" fill={C.text3} fontFamily="Space Mono, monospace">NOW</text>
                      </svg>
                      <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 16, height: 1, borderTop: `2px dashed ${C.cyan}` }} />
                          <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>Predicted</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 16, height: 2, background: C.green }} />
                          <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>Actual</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Lessons + Bias grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Card>
                      <SLabel>Lessons Recorded</SLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {['Validate assumptions earlier in cycle', 'Increase stakeholder loop frequency', 'Refine confidence calibration model'].map((l, i) => (
                          <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                            <span style={{ color: C.green, fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</span>
                            <span style={{ fontSize: 11, color: C.text2, lineHeight: 1.4 }}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card>
                      <SLabel>Bias Detection</SLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {[
                          { label: 'Overconfidence', val: 38, color: C.amber },
                          { label: 'Anchoring', val: 12, color: C.green },
                          { label: 'Recency', val: 21, color: C.cyan },
                          { label: 'Authority', val: 8, color: C.green },
                        ].map(({ label, val, color }) => (
                          <div key={label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontSize: 10, color: C.text2 }}>{label}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{val}%</span>
                            </div>
                            <Bar value={val} color={color} h={3} />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* S3 Meta Layer */}
                  <Card style={{ background: `${C.purple}0e`, borderColor: `${C.purple}44`, borderLeft: `3px solid ${C.purple}` }}>
                    <SLabel>S3 Meta Layer — Calibration</SLabel>
                    <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.6, margin: '0 0 12px' }}>
                      Overconfidence bias detected at 38%. Recommend reducing confidence priors by 8–12% for decisions with similar coupling profiles. Apply update to live calibration model?
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Btn sm primary>Apply</Btn>
                      <Btn sm>Defer</Btn>
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{ width: 200, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Option Value */}
        <Card style={{ textAlign: 'center' }}>
          <SLabel>Option Value</SLabel>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.cyan, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>
            {sel.option_value.toFixed(1)}
          </div>
        </Card>

        {/* Fragility Score */}
        <Card style={{ textAlign: 'center' }}>
          <SLabel>Fragility Score</SLabel>
          <div style={{
            fontSize: 32, fontWeight: 700, fontFamily: "'Space Mono', monospace", lineHeight: 1,
            color: sel.fragility > 3 ? C.red : sel.fragility > 2 ? C.amber : C.green,
          }}>
            {sel.fragility.toFixed(1)}
          </div>
        </Card>

        {/* Reversibility */}
        <Card>
          <SLabel right={<span style={{ fontSize: 10, color: C.cyan, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{sel.reversibility}%</span>}>
            Reversibility
          </SLabel>
          <Bar value={sel.reversibility} color={C.cyan} h={5} />
        </Card>

        {/* DAM Scores 2x2 */}
        <Card>
          <SLabel>DAM Scores</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Gravity', val: sel.gravity, color: C.orange },
              { label: 'Authority', val: sel.authority === 'HIGH' ? 9.0 : 4.5, color: C.purple },
              { label: 'Impact', val: sel.impact, color: C.red },
              { label: 'Urgency', val: sel.urgency, color: C.amber },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center', background: C.card2, borderRadius: 4, padding: '8px 4px' }}>
                <div style={{ fontSize: 8, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{typeof val === 'number' ? val.toFixed(1) : val}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Verdict */}
        <Card style={{
          background: routingBg[sel.routing] ?? `${C.text3}18`,
          borderColor: routingBorder[sel.routing] ?? C.text3,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Verdict</div>
          <div style={{
            fontSize: 14, fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em',
            color: routingBorder[sel.routing] ?? C.text3,
            marginBottom: 8,
          }}>
            {routingLabel[sel.routing] ?? sel.routing}
          </div>
          <p style={{ fontSize: 10, color: C.text2, lineHeight: 1.5, margin: 0 }}>
            {routingDesc[sel.routing] ?? ''}
          </p>
        </Card>
      </div>
    </div>
  )
}
