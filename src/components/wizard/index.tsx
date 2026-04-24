'use client'
import { useState } from 'react'
import { C } from '@/lib/constants'
import { Badge, Card, SLabel, Bar, Btn, RouteBadge } from '@/components/ui'
import type { Routing } from '@/lib/types'

const STEPS = [
  { n: '01', label: 'Define' },
  { n: '02', label: 'Frame' },
  { n: '03', label: 'Actors' },
  { n: '04', label: 'Simulate' },
  { n: '05', label: 'Stress Test' },
  { n: '06', label: 'Judge' },
  { n: '07', label: 'Commit' },
]

const TYPES = ['strategic', 'operational', 'tactical', 'ethical']

export default function DecisionWizard() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  // Step 1 — Define
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [decType, setDecType] = useState('strategic')
  const [constraints, setConstraints] = useState('')

  // Step 2 — Frame
  const [impact, setImpact] = useState(5)
  const [urgency, setUrgency] = useState(5)
  const [uncertainty, setUncertainty] = useState(5)
  const [irreversibility, setIrreversibility] = useState(5)

  // Step 3 — Actors
  const [actors, setActors] = useState([{ type: 'Human', name: '', stake: '' }, { type: 'Agent', name: '', stake: '' }, { type: 'System', name: '', stake: '' }])

  // Step 4 — Simulate
  const [pathA, setPathA] = useState('')
  const [pathB, setPathB] = useState('')
  const [pathC, setPathC] = useState('')

  // Step 5 — Stress
  const [primaryRisk, setPrimaryRisk] = useState('')
  const [cascadeRisk, setCascadeRisk] = useState('')
  const [condA, setCondA] = useState('')
  const [condB, setCondB] = useState('')

  // Step 6 — Judge
  const [verdict, setVerdict] = useState<Routing | ''>('')
  const [activation, setActivation] = useState('')

  // Step 7 — Commit
  const [owner, setOwner] = useState('')
  const [deadline, setDeadline] = useState('')
  const [exegesis, setExegesis] = useState('')

  const gravity = parseFloat(((impact * urgency * uncertainty * irreversibility) / 1000).toFixed(1))
  const gravityColor = gravity >= 7 ? C.red : gravity >= 5 ? C.amber : C.cyan

  const checklist = [
    { label: 'Title defined', done: title.length > 3 },
    { label: 'Context provided', done: context.length > 10 },
    { label: 'Gravity scored', done: step > 2 },
    { label: 'Actors mapped', done: actors.some(a => a.name.length > 0) },
    { label: 'Scenarios written', done: pathA.length > 5 },
    { label: 'Stress tested', done: primaryRisk.length > 5 },
    { label: 'Verdict selected', done: verdict !== '' },
    { label: 'Committed', done: submitted },
  ]

  const inputStyle: React.CSSProperties = {
    width: '100%', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 5,
    padding: '9px 12px', color: C.text1, fontSize: 12, outline: 'none',
    fontFamily: "'Space Grotesk',sans-serif",
  }
  const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', minHeight: 80 }

  const handleSubmit = () => setSubmitted(true)

  if (submitted) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 40, color: C.green }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Decision Committed</div>
        <div style={{ fontSize: 12, color: C.text2 }}>Logged to the immutable directive archive.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 12, minWidth: 400 }}>
          {[['Gravity', `${gravity}/10`, gravityColor], ['Routing', verdict, verdict === 'ACT' ? C.green : verdict === 'ESCALATE' ? C.red : C.text3], ['Type', decType, C.cyan]].map(([l, v, c]) => (
            <Card key={l as string} style={{ textAlign: 'center', padding: '14px' }}>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>{l as string}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c as string, textTransform: 'uppercase' }}>{v as string}</div>
            </Card>
          ))}
        </div>
        <Btn primary onClick={() => { setSubmitted(false); setStep(1); setTitle(''); setContext('') }}>START NEW DECISION</Btn>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', minWidth: 0 }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, alignItems: 'center' }}>
          {STEPS.map((s, i) => {
            const n = i + 1
            const done = step > n
            const active = step === n
            return (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
                <div onClick={() => n < step && setStep(n)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: n < step ? 'pointer' : 'default' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: done ? C.green : active ? C.orange : C.border2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: done || active ? '#fff' : C.text3,
                    fontFamily: "'Space Mono',monospace",
                  }}>{done ? '✓' : s.n}</div>
                  <div style={{ fontSize: 9, color: active ? C.orange : C.text3, marginTop: 4, fontFamily: "'Space Mono',monospace", whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: done ? C.green : C.border, flexShrink: 0, marginBottom: 16 }} />}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div style={{ maxWidth: 640 }}>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Define the Decision</div>
              <div>
                <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Decision Title *</label>
                <input style={inputStyle} placeholder="e.g. Infrastructure Migration to ARM-64" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Decision Context *</label>
                <textarea style={taStyle} placeholder="Describe the situation, background, and why this decision is being made now..." value={context} onChange={e => setContext(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Decision Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setDecType(t)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${decType === t ? C.orange : C.border2}`, background: decType === t ? `${C.orange}18` : 'transparent', color: decType === t ? C.orange : C.text2, textTransform: 'capitalize', transition: 'all 0.15s' }}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Constraints</label>
                <textarea style={{ ...taStyle, minHeight: 60 }} placeholder="Budget, timeline, regulatory, or resource constraints..." value={constraints} onChange={e => setConstraints(e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Frame the Gravity</div>
              <div style={{ padding: '14px 18px', background: `${gravityColor}14`, border: `1px solid ${gravityColor}44`, borderRadius: 6, textAlign: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>GRAVITY SCORE</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: gravityColor, lineHeight: 1 }}>{gravity}</div>
                <div style={{ fontSize: 10, color: C.text3, marginTop: 4 }}>Impact × Urgency × Uncertainty × Irreversibility / 1000</div>
              </div>
              {[['IMPACT', impact, setImpact, C.orange, 'How significantly does this affect outcomes?'],
                ['URGENCY', urgency, setUrgency, C.red, 'How time-sensitive is this decision?'],
                ['UNCERTAINTY', uncertainty, setUncertainty, C.amber, 'How much do we not know about outcomes?'],
                ['IRREVERSIBILITY', irreversibility, setIrreversibility, C.purple, 'How hard is it to undo this decision?'],
              ].map(([label, val, setter, color, desc]) => (
                <div key={label as string}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 10, color: color as string, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em' }}>{label as string}</span>
                      <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>{desc as string}</div>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: color as string, fontFamily: "'Space Mono',monospace" }}>{val as number}</span>
                  </div>
                  <input type="range" min={1} max={10} step={1} value={val as number}
                    onChange={e => (setter as React.Dispatch<React.SetStateAction<number>>)(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: color as string }} />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Map the Actors</div>
              {actors.map((actor, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    {['Human', 'Agent', 'System', 'External'].map(t => (
                      <button key={t} onClick={() => { const a = [...actors]; a[i].type = t; setActors(a) }} style={{ padding: '4px 10px', borderRadius: 3, fontSize: 10, cursor: 'pointer', border: `1px solid ${actors[i].type === t ? C.cyan : C.border}`, background: actors[i].type === t ? `${C.cyan}18` : 'transparent', color: actors[i].type === t ? C.cyan : C.text3, fontFamily: "'Space Mono',monospace" }}>{t}</button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input style={inputStyle} placeholder="Name / Role" value={actor.name} onChange={e => { const a = [...actors]; a[i].name = e.target.value; setActors(a) }} />
                    <input style={inputStyle} placeholder="Stake / Interest" value={actor.stake} onChange={e => { const a = [...actors]; a[i].stake = e.target.value; setActors(a) }} />
                  </div>
                </Card>
              ))}
              <Btn sm onClick={() => setActors([...actors, { type: 'Human', name: '', stake: '' }])}>+ ADD ACTOR</Btn>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Simulate Forward Paths</div>
              {[['Path A', pathA, setPathA, C.green], ['Path B', pathB, setPathB, C.cyan], ['Path C', pathC, setPathC, C.orange]].map(([label, val, setter, color]) => (
                <Card key={label as string} style={{ borderLeft: `3px solid ${color as string}` }}>
                  <div style={{ fontSize: 10, color: color as string, fontFamily: "'Space Mono',monospace", marginBottom: 8, fontWeight: 700 }}>{label as string}</div>
                  <textarea style={taStyle} placeholder={`Describe the ${label} scenario — what happens if we take this route?`} value={val as string} onChange={e => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)} />
                </Card>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Stress Test</div>
              <Card style={{ background: `${C.red}08`, border: `1px solid ${C.red}28` }}>
                <div style={{ fontSize: 10, color: C.red, fontFamily: "'Space Mono',monospace", marginBottom: 8 }}>INVERSION — FAILURE MODES</div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 5 }}>Primary Risk</label>
                  <textarea style={{ ...taStyle, minHeight: 60 }} placeholder="What is the single most likely way this fails?" value={primaryRisk} onChange={e => setPrimaryRisk(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 5 }}>Cascade Risk</label>
                  <textarea style={{ ...taStyle, minHeight: 60 }} placeholder="What second-order failures could follow?" value={cascadeRisk} onChange={e => setCascadeRisk(e.target.value)} />
                </div>
              </Card>
              <SLabel>What Would Change My Mind?</SLabel>
              {[['Condition A', condA, setCondA], ['Condition B', condB, setCondB]].map(([label, val, setter]) => (
                <div key={label as string} style={{ padding: '12px 14px', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 5, borderLeft: `3px solid ${C.orange}` }}>
                  <div style={{ fontSize: 9, color: C.orange, fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>{label as string}</div>
                  <input style={inputStyle} placeholder={`If X happens, this decision is no longer valid...`} value={val as string} onChange={e => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Judge — Routing Verdict</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {([['ACT', C.green, 'Authority sufficient. Proceed immediately.'], ['ESCALATE', C.red, 'High gravity, insufficient authority.'], ['DEFER', C.text3, 'Low gravity. Batch for later review.']] as const).map(([v, c, desc]) => (
                  <div key={v} onClick={() => setVerdict(v)} style={{ padding: 16, borderRadius: 6, cursor: 'pointer', border: `1px solid ${verdict === v ? c : C.border}`, background: verdict === v ? `${c}14` : C.card2, textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: verdict === v ? c : C.text2, marginBottom: 6 }}>{v}</div>
                    <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 6 }}>Activation Conditions</label>
                <textarea style={taStyle} placeholder="Under what specific conditions should this verdict be executed?" value={activation} onChange={e => setActivation(e.target.value)} />
              </div>
              <Card style={{ background: C.card2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, color: C.text3 }}>Gravity Score</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: gravityColor }}>{gravity}/10</div>
                </div>
              </Card>
            </div>
          )}

          {step === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Commit the Decision</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 6 }}>Decision Owner</label>
                  <input style={inputStyle} placeholder="Who is accountable?" value={owner} onChange={e => setOwner(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 6 }}>Deadline</label>
                  <input type="date" style={inputStyle} value={deadline} onChange={e => setDeadline(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 6 }}>Exegesis Notes</label>
                <textarea style={taStyle} placeholder="Final context, assumptions, and reasoning for the record..." value={exegesis} onChange={e => setExegesis(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[['Gravity Score', `${gravity}/10`, gravityColor], ['Routing', verdict || '—', verdict === 'ACT' ? C.green : verdict === 'ESCALATE' ? C.red : C.text3], ['Decision Type', decType, C.cyan]].map(([l, v, c]) => (
                  <Card key={l as string} style={{ textAlign: 'center', padding: '12px' }}>
                    <div style={{ fontSize: 8, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>{l as string}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c as string, textTransform: 'capitalize' }}>{v as string}</div>
                  </Card>
                ))}
              </div>
              <button onClick={handleSubmit} style={{ padding: '14px 20px', background: C.orange, color: '#fff', border: 'none', borderRadius: 5, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif" }}>
                ▶ SUBMIT DECISION TO ARCHIVE
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <Btn onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>← PREVIOUS</Btn>
          {step < 7 && <Btn primary onClick={() => setStep(s => Math.min(7, s + 1))}>NEXT →</Btn>}
        </div>
      </div>

      {/* Right: Live preview */}
      <div style={{ width: 280, flexShrink: 0, background: C.card2, borderLeft: `1px solid ${C.border}`, padding: 16, overflowY: 'auto' }}>
        <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 14, letterSpacing: '0.1em' }}>DECISION BRIEF — LIVE</div>

        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5, color: title ? C.text1 : C.text3 }}>{title || 'Untitled Decision'}</div>
          {decType && <Badge color={C.cyan}>{decType}</Badge>}
        </Card>

        <Card style={{ marginBottom: 12, background: `${gravityColor}10`, border: `1px solid ${gravityColor}35` }}>
          <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>GRAVITY SCORE</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: gravityColor, lineHeight: 1, marginBottom: 10 }}>{gravity}</div>
          {[['Impact', impact, C.orange], ['Urgency', urgency, C.red], ['Uncertainty', uncertainty, C.amber], ['Irreversibility', irreversibility, C.purple]].map(([label, val, color]) => (
            <div key={label as string} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 9, color: C.text3 }}>{label as string}</span>
                <span style={{ fontSize: 9, color: color as string, fontFamily: "'Space Mono',monospace" }}>{val as number}/10</span>
              </div>
              <Bar value={(val as number) * 10} color={color as string} h={2} />
            </div>
          ))}
        </Card>

        {verdict && (
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>VERDICT</div>
            <RouteBadge r={verdict} />
          </Card>
        )}

        <Card style={{ background: 'transparent', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 10 }}>CHECKLIST</div>
          {checklist.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'center' }}>
              <span style={{ color: item.done ? C.green : C.border2, fontSize: 11, flexShrink: 0 }}>{item.done ? '✓' : '○'}</span>
              <span style={{ fontSize: 11, color: item.done ? C.text2 : C.text3 }}>{item.label}</span>
            </div>
          ))}
        </Card>

        <div style={{ marginTop: 14, padding: '10px 12px', background: C.card, borderRadius: 5, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>CURRENT STEP</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>{STEPS[step - 1].n} — {STEPS[step - 1].label}</div>
        </div>
      </div>
    </div>
  )
}
