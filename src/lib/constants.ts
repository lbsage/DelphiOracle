import type { Decision, LogEntry, Cluster, ClusterMember, FeedItem, Handoff } from './types'

export const C = {
  bg:      '#0e0c0b',
  card:    '#151210',
  card2:   '#1c1915',
  card3:   '#232018',
  border:  '#2a2520',
  border2: '#3a3430',
  orange:  '#ff5500',
  cyan:    '#00d4b4',
  purple:  '#b040ff',
  text1:   '#f0ece6',
  text2:   '#9a9490',
  text3:   '#5a5450',
  green:   '#00e87a',
  amber:   '#ffaa00',
  red:     '#ff3545',
} as const

export const NAV = [
  { id: 'wizard',     label: 'Decision Wizard',  icon: '◇', href: '/wizard' },
  { id: 'command',    label: 'Command Center',   icon: '⊕', href: '/command-center' },
  { id: 'mission',    label: 'Mission Control',  icon: '◈', href: '/mission-control' },
  { id: 'theater',    label: 'Decision Theater', icon: '⬡', href: '/decision-theater' },
  { id: 'log',        label: 'Decision Log',     icon: '≡', href: '/decision-log' },
  { id: 'intel',      label: 'Intelligence',     icon: '◎', href: '/intelligence' },
  { id: 'govern',     label: 'Governance',       icon: '⬟', href: '/governance' },
  { id: 'workspace',  label: 'Workspace',        icon: '⬢', href: '/workspace' },
] as const

export const SEED_DECISIONS: Decision[] = [
  {
    id: 'dec-091', ref: 'APR_2026_0091', title: 'Infrastructure Migration ARM-64',
    gravity: 9.2, impact: 9, urgency: 8, uncertainty: 7, irreversibility: 9,
    authority: 'LOW', routing: 'ESCALATE', confidence: 78, reversibility: 42,
    option_value: 8.4, fragility: 2.1, status: 'CRITICAL',
    path: ['Assess current x86 workload matrix', 'Provision ARM pilot cluster (N=12)', 'Migrate non-critical services first'],
    inverse: '34% risk of cache coherence failures under sustained load spikes exceeding P95.',
    exegesis: 'System identifies critical timing dependency in the finance module. ARM migration during Q2 reporting window carries high state corruption risk. Recommend phased approach with rollback checkpoints at each stage boundary.',
    conditions: [
      'If finance module cache miss rate exceeds 8% in ARM pilot, abort and revert to x86 indefinitely.',
      'If ARM latency benchmark exceeds 340ms P99, full migration halted pending architecture review.',
    ],
    tags: ['REVERSIBLE', 'HIGH CONF'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'dec-092', ref: 'APR_2026_0092', title: 'Q3 Market Expansion — Southeast Asia',
    gravity: 7.8, impact: 8, urgency: 6, uncertainty: 8, irreversibility: 7,
    authority: 'HIGH', routing: 'ACT', confidence: 92, reversibility: 71,
    option_value: 7.1, fragility: 1.8, status: 'ACTIVE',
    path: ['Establish Singapore legal entity', 'Activate regional distribution partner', 'Soft launch in SG/MY markets Q3'],
    inverse: '18% risk of regulatory friction in MY market timeline slippage by 90 days.',
    exegesis: 'Competitive window identified. Three rivals delayed expansion. Market entry cost 40% lower than 6-month projection. Authority sufficient for immediate commitment.',
    conditions: [
      'If MAS entity approval exceeds 60 days, pivot to partner-model entry without direct entity.',
      'If Q3 GDP contraction exceeds 2%, delay by one quarter and reassess.',
    ],
    tags: ['HIGH CONF', 'WINDOW OPEN'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'dec-093', ref: 'APR_2026_0093', title: 'Series B Valuation Cap Negotiation',
    gravity: 6.4, impact: 9, urgency: 4, uncertainty: 6, irreversibility: 8,
    authority: 'LOW', routing: 'ESCALATE', confidence: 65, reversibility: 28,
    option_value: 6.8, fragility: 3.4, status: 'PENDING',
    path: ['Prepare financial model variants (3 scenarios)', 'Map investor priority matrix', 'Define walk-away conditions pre-term sheet'],
    inverse: '22% probability of down-round conditions if engagement delayed past 45 days.',
    exegesis: 'Valuation anchoring effects detected across three comparable transactions. Current market sentiment window: 14 days. Recommend establishing floor before term sheet arrives.',
    conditions: [
      'If lead investor introduces participating preferred terms, switch to flat common preference.',
      'If comparable valuations drop 15%+ in 30 days, reduce ask by 20% proactively.',
    ],
    tags: ['IRREVERSIBLE', 'ESCALATE'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'dec-094', ref: 'APR_2026_0094', title: 'Hire VP Engineering (External)',
    gravity: 4.1, impact: 6, urgency: 3, uncertainty: 5, irreversibility: 5,
    authority: 'HIGH', routing: 'DEFER', confidence: 81, reversibility: 85,
    option_value: 5.2, fragility: 1.4, status: 'QUEUED',
    path: ['Define structured role scorecard', 'Activate executive search firm', 'Run blind structured panel interviews'],
    inverse: '9% risk of internal morale impact if external hire announced before internal pipeline exhausted.',
    exegesis: 'No urgency trigger detected. Internal candidate pipeline has 60-day runway. Recommend batching with Q3 headcount review cycle.',
    conditions: [
      'If internal candidate pipeline empties by June, trigger external search immediately.',
      'If engineering velocity drops 25% over 6 weeks, accelerate timeline.',
    ],
    tags: ['DEFERRABLE'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export const SEED_LOG: LogEntry[] = [
  { id: 'log-1', ref: 'APR_2026_0091', title: 'Infrastructure Migration ARM-64', status: 'COMMITTED',
    description: 'Phased migration to ARM-64 cluster approved. System 2 Analysis flags high reversibility debt. Primary friction: latency variance in finance module during Q2.',
    success_prob: 78, impact_delta: '+14%', reversibility: 88, tags: ['EXEGESIS','ANALOGY','COUNTER'], logged_at: new Date().toISOString() },
  { id: 'log-2', ref: 'DEC_2025_0082', title: 'Autonomous Freight Corridor (B-12)', status: 'SIMULATED',
    description: 'Hypothetical conversion of logistics routes to Level 5 autonomous fleets. Simulation flagged critical "Cascading Delay" risk under weather variance. Not committed.',
    success_prob: 42, impact_delta: '+22%', reversibility: 15, tags: ['EXEGESIS','ANALOGY','COUNTER'], logged_at: new Date().toISOString() },
  { id: 'log-3', ref: 'DEC_2025_0071 [CRITICAL_FAILURE]', title: 'Regional Grid Surcharge Alpha', status: 'DISCARDED',
    description: 'Proposal to dynamically price energy during peak volatility. Auto-discarded by Delphi S3 layer after identifying 89% probability of public unrest.',
    success_prob: 12, impact_delta: '-32%', reversibility: 4, tags: ['POST-MORTEM'], logged_at: new Date().toISOString() },
  { id: 'log-4', ref: 'NOV_2025_0068', title: 'Series A Follow-On Bridge Round', status: 'COMMITTED',
    description: 'Bridge financing approved to extend runway 14 months. Calibration model projected 91% success. Actual outcome aligned within 3% of forecast — strong calibration signal.',
    success_prob: 91, impact_delta: '+8%', reversibility: 62, tags: ['EXEGESIS','ANALOGY'], logged_at: new Date().toISOString() },
]

export const SEED_CLUSTERS: Cluster[] = [
  { id: 'cl-1', name: 'HELIOS_X1',      session_id: '0x442-SIM', status: 'SIMULATING',     description: 'Cross-verification of decision pathway anomalies in Sector 7.', progress: 62, risk_level: 'HIGH',   agents: ['GPT-4o','Planner','Judge'],            humans: 2 },
  { id: 'cl-2', name: 'QUANTUM_ENTROPY', session_id: '0x891-REV', status: 'REVIEW NEEDED',  description: 'Entropy mapping across decision nodes — risk threshold breach detected.', progress: 89, risk_level: 'CRITICAL', agents: ['Inversion','Meta'],             humans: 3 },
  { id: 'cl-3', name: 'CORE_PROTOCOLS',  session_id: '0x223-STB', status: 'STABLE',         description: 'Protocol validation and authority matrix compliance sweep.', progress: 100, risk_level: 'LOW',  agents: ['Exegesis','Judge'],                    humans: 1 },
  { id: 'cl-4', name: 'NEXUS_DELTA',     session_id: '0x667-ACT', status: 'ACTIVE',         description: 'Multi-agent negotiation scenario for Series B cap structure.', progress: 41, risk_level: 'MEDIUM', agents: ['Planner','Counterfactual','Meta'],  humans: 2 },
  { id: 'cl-5', name: 'SIGMA_PRIME',     session_id: '0x334-AWI', status: 'AWAITING INPUT',  description: 'VP Engineering search parameter tuning — awaiting HR data sync.', progress: 18, risk_level: 'LOW', agents: ['Exegesis'],                          humans: 1 },
  { id: 'cl-6', name: 'OBSERVER_7',      session_id: '0x119-MON', status: 'MONITORING',     description: 'Passive observation layer — tracking drift across all active clusters.', progress: 55, risk_level: 'MEDIUM', agents: ['Meta'],                      humans: 0 },
]

export const SEED_MEMBERS: ClusterMember[] = [
  { id: 'm-1', cluster_id: 'cl-1', member_type: 'agent', name: 'GPT-4o',        role: 'Primary Reasoner',    load_pct: 87, status: 'SCENARIO_SPLIT' },
  { id: 'm-2', cluster_id: 'cl-1', member_type: 'agent', name: 'Planner',       role: 'Scenario Builder',    load_pct: 72, status: 'AGENT_ACTIVE' },
  { id: 'm-3', cluster_id: 'cl-2', member_type: 'agent', name: 'Inversion',     role: 'Failure Mode Analyst', load_pct: 94, status: 'FAILURE_MODES' },
  { id: 'm-4', cluster_id: 'cl-2', member_type: 'agent', name: 'Meta',          role: 'Calibration',         load_pct: 61, status: 'CALIBRATION' },
  { id: 'm-5', cluster_id: 'cl-3', member_type: 'agent', name: 'Exegesis',      role: 'Context Reconstruction', load_pct: 44, status: 'CONTEXT_RECALL' },
  { id: 'm-6', cluster_id: 'cl-1', member_type: 'human', name: 'Sarah K.',      role: 'Lead Analyst',        load_pct: 78, status: 'ONLINE' },
  { id: 'm-7', cluster_id: 'cl-2', member_type: 'human', name: 'K. Chen',       role: 'Risk Officer',        load_pct: 65, status: 'ONLINE' },
  { id: 'm-8', cluster_id: 'cl-4', member_type: 'human', name: 'M. Rodriguez',  role: 'Strategy Lead',       load_pct: 82, status: 'IN REVIEW' },
  { id: 'm-9', cluster_id: 'cl-5', member_type: 'human', name: 'J. Park',       role: 'Ops Coordinator',     load_pct: 31, status: 'STANDBY' },
]

export const SEED_FEED: FeedItem[] = [
  { id: 'f-1', cluster_id: 'cl-2', author: 'Inversion Agent', author_type: 'agent', content: 'ALERT: Entropy threshold breached at node 7-Alpha. Cascade probability now 38%. Recommend immediate human review.', tags: ['RISK','ESCALATION'], created_at: new Date(Date.now() - 180000).toISOString() },
  { id: 'f-2', cluster_id: 'cl-1', author: 'Sarah K.', author_type: 'human', content: 'Confirmed ARM pilot results are within spec. Cache miss rate holding at 6.2% — below the 8% abort threshold. Proceeding.', tags: ['CONFIRMED'], created_at: new Date(Date.now() - 360000).toISOString() },
  { id: 'f-3', cluster_id: 'cl-4', author: 'Planner', author_type: 'agent', content: 'Three Series B scenarios modeled. Path B (structured equity) shows highest option value at 7.8. Counterfactual analysis complete.', tags: ['ANALYSIS','COMPLETE'], created_at: new Date(Date.now() - 600000).toISOString() },
  { id: 'f-4', cluster_id: 'cl-2', author: 'K. Chen', author_type: 'human', content: 'Reviewing entropy breach. Initial read: overfitting to recent volatility. Will cross-check with 90-day baseline before escalating.', tags: ['REVIEW'], created_at: new Date(Date.now() - 900000).toISOString() },
]

export const SEED_HANDOFFS: Handoff[] = [
  { id: 'h-1', cluster_id: 'cl-2', from_name: 'Inversion Agent', from_type: 'agent', to_name: 'K. Chen', to_type: 'human', content: 'Entropy cascade risk exceeds autonomous threshold. Requires human judgment on escalation path.', is_urgent: true, status: 'PENDING', created_at: new Date(Date.now() - 120000).toISOString() },
  { id: 'h-2', cluster_id: 'cl-1', from_name: 'GPT-4o', from_type: 'agent', to_name: 'Sarah K.', to_type: 'human', content: 'ARM migration path A confidence 84%. Requesting final authorization before committing phase 2 resources.', is_urgent: true, status: 'PENDING', created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 'h-3', cluster_id: 'cl-4', from_name: 'M. Rodriguez', from_type: 'human', to_name: 'Planner', to_type: 'agent', content: 'Run scenario sensitivity on Path B with 15% valuation compression. Update by EOD.', is_urgent: false, status: 'IN_PROGRESS', created_at: new Date(Date.now() - 720000).toISOString() },
]
