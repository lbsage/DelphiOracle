'use client'
import { useState } from 'react'
import { Badge, Dot, Card, SLabel, Bar, Btn, RouteBadge } from '@/components/ui'
import { C, SEED_CLUSTERS, SEED_MEMBERS, SEED_FEED, SEED_HANDOFFS } from '@/lib/constants'
import type { Cluster } from '@/lib/types'

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  HELIOS_X1:      { x: 120, y: 40  },
  QUANTUM_ENTROPY: { x: 210, y: 85  },
  CORE_PROTOCOLS: { x: 195, y: 170 },
  NEXUS_DELTA:    { x: 120, y: 190 },
  SIGMA_PRIME:    { x: 40,  y: 155 },
  OBSERVER_7:     { x: 30,  y: 75  },
}

const NODE_COLORS: Record<string, string> = {
  HELIOS_X1:      C.cyan,
  QUANTUM_ENTROPY: C.amber,
  CORE_PROTOCOLS: C.green,
  NEXUS_DELTA:    C.orange,
  SIGMA_PRIME:    C.text3,
  OBSERVER_7:     C.purple,
}

const EDGES = [
  ['HELIOS_X1', 'QUANTUM_ENTROPY'],
  ['HELIOS_X1', 'NEXUS_DELTA'],
  ['QUANTUM_ENTROPY', 'OBSERVER_7'],
  ['NEXUS_DELTA', 'SIGMA_PRIME'],
  ['CORE_PROTOCOLS', 'OBSERVER_7'],
]

const RISK_COLOR: Record<string, string> = {
  CRITICAL: C.red,
  HIGH: C.orange,
  MEDIUM: C.amber,
  LOW: C.green,
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Workspace() {
  const [selectedCluster, setSelectedCluster] = useState<Cluster>(SEED_CLUSTERS[0])
  const [feedTab, setFeedTab] = useState<'intelligence' | 'handoffs' | 'all'>('intelligence')
  const [dismissedBanner, setDismissedBanner] = useState(false)
  const [composeText, setComposeText] = useState('')

  const agents  = SEED_MEMBERS.filter(m => m.member_type === 'agent')
  const humans  = SEED_MEMBERS.filter(m => m.member_type === 'human')
  const urgentHandoffs = SEED_HANDOFFS.filter(h => h.is_urgent && h.status === 'PENDING')

  const clusterFeed = SEED_FEED.filter(f => f.cluster_id === selectedCluster.id)
  const allFeed = [...SEED_FEED].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const feedItems = feedTab === 'intelligence' ? clusterFeed : feedTab === 'all' ? allFeed : []

  return (
    <div style={{
      display: 'flex', gap: 0, height: '100%', minHeight: '100vh',
      background: C.bg, fontFamily: "'Space Mono', monospace",
    }}>
      {/* ── LEFT COLUMN ────────────────────────────────── */}
      <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, overflowY: 'auto', flex: 1 }}>

          {/* Escalation Banner */}
          {!dismissedBanner && (
            <div style={{
              background: `${C.amber}18`, border: `1px solid ${C.amber}55`,
              borderRadius: 6, padding: '10px 12px', marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Dot color={C.amber} pulse />
                <span style={{ fontSize: 9, fontWeight: 700, color: C.amber, letterSpacing: '0.1em', textTransform: 'uppercase' }}>QUANTUM_ENTROPY</span>
              </div>
              <div style={{ fontSize: 11, color: C.text1, marginBottom: 10, lineHeight: 1.5 }}>Risk threshold breached</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setSelectedCluster(SEED_CLUSTERS[1])} style={{
                  flex: 1, background: `${C.amber}22`, border: `1px solid ${C.amber}55`,
                  borderRadius: 3, padding: '4px 0', fontSize: 9, fontWeight: 700,
                  color: C.amber, cursor: 'pointer', letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>Open Cluster</button>
                <button onClick={() => setDismissedBanner(true)} style={{
                  flex: 1, background: 'transparent', border: `1px solid ${C.border2}`,
                  borderRadius: 3, padding: '4px 0', fontSize: 9, fontWeight: 700,
                  color: C.text3, cursor: 'pointer', letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>Dismiss</button>
              </div>
            </div>
          )}

          {/* Cluster Topology Header */}
          <SLabel>Cluster Topology</SLabel>

          {/* SVG Network Graph */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 12, overflow: 'hidden' }}>
            <svg width="100%" height={200} viewBox="0 0 240 210">
              <style>{`
                @keyframes pulse-ring {
                  0% { r: 22; opacity: 0.8; }
                  100% { r: 30; opacity: 0; }
                }
                .pulse-ring { animation: pulse-ring 1.4s ease-out infinite; }
              `}</style>
              {/* Edges */}
              {EDGES.map(([a, b], i) => {
                const pa = NODE_POSITIONS[a], pb = NODE_POSITIONS[b]
                return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  stroke={C.border2} strokeWidth={1} strokeDasharray="3 3" />
              })}
              {/* Nodes */}
              {SEED_CLUSTERS.map(cl => {
                const pos = NODE_POSITIONS[cl.name]
                const col = NODE_COLORS[cl.name]
                const isSelected = cl.id === selectedCluster.id
                const abbr = cl.name.split('_').map(w => w[0]).join('').slice(0, 3)
                return (
                  <g key={cl.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedCluster(cl)}>
                    {isSelected && (
                      <circle className="pulse-ring" cx={pos.x} cy={pos.y} r={22} fill="none"
                        stroke={col} strokeWidth={2} opacity={0.7} />
                    )}
                    <circle cx={pos.x} cy={pos.y} r={18}
                      fill={`${col}22`} stroke={col} strokeWidth={isSelected ? 2 : 1} />
                    <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                      fill={col} fontSize={8} fontWeight={700} fontFamily="'Space Mono', monospace">
                      {abbr}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Cluster List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SEED_CLUSTERS.map(cl => {
              const col = NODE_COLORS[cl.name]
              const isSelected = cl.id === selectedCluster.id
              return (
                <div key={cl.id} onClick={() => setSelectedCluster(cl)} style={{
                  padding: '8px 10px', borderRadius: 5, cursor: 'pointer',
                  background: isSelected ? `${col}14` : 'transparent',
                  border: `1px solid ${isSelected ? `${col}44` : 'transparent'}`,
                  transition: 'all 0.12s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <Dot color={col} />
                    <span style={{ fontSize: 10, color: C.text1, flex: 1, fontFamily: "'Space Mono', monospace" }}>{cl.name}</span>
                    <Badge color={RISK_COLOR[cl.risk_level]}>{cl.risk_level}</Badge>
                  </div>
                  <Bar value={cl.progress} color={col} h={3} style={{ marginBottom: 5 }} />
                  <div style={{ display: 'flex', gap: 8, fontSize: 9, color: C.text3 }}>
                    <span>{cl.agents.length} agents</span>
                    <span>{cl.humans} humans</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── CENTER ─────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Feed Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '0 16px' }}>
          {([
            { id: 'intelligence', label: 'Intelligence Feed' },
            { id: 'handoffs',     label: 'Handoffs' },
            { id: 'all',          label: 'All Clusters' },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setFeedTab(tab.id)} style={{
              background: 'transparent', border: 'none', borderBottom: `2px solid ${feedTab === tab.id ? C.orange : 'transparent'}`,
              color: feedTab === tab.id ? C.text1 : C.text3, padding: '12px 16px',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Space Mono', monospace", transition: 'all 0.12s',
            }}>{tab.label}</button>
          ))}
          {feedTab === 'handoffs' && urgentHandoffs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Badge color={C.amber}>{urgentHandoffs.length} urgent</Badge>
            </div>
          )}
        </div>

        {/* Feed Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {/* Intelligence Feed / All Clusters */}
          {(feedTab === 'intelligence' || feedTab === 'all') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {feedItems.map(item => {
                const cluster = SEED_CLUSTERS.find(c => c.id === item.cluster_id)
                const avatarColor = item.author_type === 'human' ? C.orange : C.purple
                return (
                  <Card key={item.id} style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: `${avatarColor}22`,
                        border: `1px solid ${avatarColor}55`, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 10, fontWeight: 700, color: avatarColor,
                        flexShrink: 0,
                      }}>{initials(item.author)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>{item.author}</span>
                          <Badge color={item.author_type === 'human' ? C.orange : C.purple}>
                            {item.author_type}
                          </Badge>
                          {feedTab === 'all' && cluster && (
                            <Badge color={NODE_COLORS[cluster.name]}>{cluster.name}</Badge>
                          )}
                          <span style={{ fontSize: 9, color: C.text3, marginLeft: 'auto' }}>{timeAgo(item.created_at)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.6, marginBottom: 8 }}>{item.content}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {item.tags.map(t => <Badge key={t} color={C.text3}>{t}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
              {feedItems.length === 0 && (
                <div style={{ textAlign: 'center', color: C.text3, fontSize: 11, padding: '40px 0' }}>
                  No feed items for this cluster
                </div>
              )}
            </div>
          )}

          {/* Handoffs Tab */}
          {feedTab === 'handoffs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SEED_HANDOFFS.map(h => (
                <Card key={h.id} style={{ padding: '12px 14px', borderColor: h.is_urgent ? `${C.amber}44` : C.border }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: h.from_type === 'agent' ? C.purple : C.orange }}>{h.from_name}</span>
                    <span style={{ color: C.text3, fontSize: 12 }}>→</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: h.to_type === 'agent' ? C.purple : C.orange }}>{h.to_name}</span>
                    {h.is_urgent && <Badge color={C.red}>URGENT</Badge>}
                    <Badge color={C.text3}>{h.status}</Badge>
                    <span style={{ fontSize: 9, color: C.text3, marginLeft: 'auto' }}>{timeAgo(h.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.6, marginBottom: h.is_urgent && h.status === 'PENDING' ? 10 : 0 }}>
                    {h.content}
                  </div>
                  {h.is_urgent && h.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <Btn sm style={{ color: C.green, borderColor: `${C.green}55` }}>Accept &amp; Respond</Btn>
                      <Btn sm>Delegate Back</Btn>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Compose Bar */}
        {feedTab !== 'handoffs' && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', gap: 10 }}>
            <input
              value={composeText}
              onChange={e => setComposeText(e.target.value)}
              placeholder="Push reasoning update..."
              style={{
                flex: 1, background: C.card2, border: `1px solid ${C.border2}`,
                borderRadius: 4, padding: '8px 12px', fontSize: 11, color: C.text1,
                fontFamily: "'Space Mono', monospace", outline: 'none',
              }}
            />
            <Btn primary onClick={() => setComposeText('')} disabled={!composeText.trim()}>Send</Btn>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN ───────────────────────────────── */}
      <div style={{ width: 220, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Agent Network */}
        <div>
          <SLabel>Agent Network</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agents.map(m => (
              <div key={m.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.text1 }}>{m.name}</span>
                  <Badge color={m.load_pct > 85 ? C.red : m.load_pct > 65 ? C.amber : C.green}>{m.status?.split('_')[0]}</Badge>
                </div>
                <div style={{ fontSize: 9, color: C.text3, marginBottom: 6 }}>{m.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bar value={m.load_pct} color={m.load_pct > 85 ? C.red : m.load_pct > 65 ? C.amber : C.cyan} style={{ flex: 1 }} />
                  <span style={{ fontSize: 9, color: C.text3, width: 28, textAlign: 'right' }}>{m.load_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Analysts */}
        <div>
          <SLabel>Human Analysts</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {humans.map(m => {
              const tasks = SEED_HANDOFFS.filter(h => h.to_name === m.name || h.from_name === m.name)
              return (
                <div key={m.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 5, padding: '8px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.text1 }}>{m.name}</span>
                    <Badge color={m.status === 'ONLINE' ? C.green : m.status === 'IN REVIEW' ? C.cyan : C.text3}>
                      {m.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 9, color: C.text3, marginBottom: 6 }}>{m.role}</div>
                  {tasks.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {tasks.slice(0, 2).map(t => (
                        <div key={t.id} style={{ fontSize: 9, color: C.text2, display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                          <span style={{ color: C.orange, flexShrink: 0 }}>›</span>
                          <span style={{ lineHeight: 1.4 }}>{t.content.slice(0, 45)}…</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Pending Handoffs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SLabel>Pending Handoffs</SLabel>
            <Badge color={C.amber}>{urgentHandoffs.length} urgent</Badge>
          </div>
        </div>

        {/* Hub Operations */}
        <div>
          <SLabel>Hub Operations</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              { label: 'Export Session', color: C.cyan },
              { label: 'Re-Sync All',    color: C.text2 },
              { label: 'Spawn Agent',   color: C.purple },
              { label: 'Comm Link',     color: C.orange },
            ].map(({ label, color }) => (
              <button key={label} style={{
                background: `${color}14`, border: `1px solid ${color}44`,
                borderRadius: 4, padding: '8px 6px', fontSize: 9, fontWeight: 700,
                color, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
                fontFamily: "'Space Mono', monospace", textAlign: 'center',
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
