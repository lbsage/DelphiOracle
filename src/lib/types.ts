export type Routing = 'ACT' | 'ESCALATE' | 'DEFER'
export type DecisionStatus = 'CRITICAL' | 'ACTIVE' | 'PENDING' | 'QUEUED'
export type LogStatus = 'COMMITTED' | 'SIMULATED' | 'DISCARDED'
export type AARStatus = 'DUE' | 'REVIEW_NEEDED' | 'WAITING_DATA' | 'COMPLETE'
export type ClusterStatus = 'SIMULATING' | 'REVIEW NEEDED' | 'STABLE' | 'ACTIVE' | 'AWAITING INPUT' | 'MONITORING'
export type MemberType = 'human' | 'agent'
export type Severity = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Decision {
  id: string
  ref: string
  title: string
  context?: string
  decision_type?: string
  gravity: number
  impact: number
  urgency: number
  uncertainty: number
  irreversibility: number
  authority: string
  routing: Routing
  confidence: number
  reversibility: number
  option_value: number
  fragility: number
  status: DecisionStatus
  path: string[]
  inverse: string
  exegesis: string
  conditions: string[]
  tags: string[]
  owner_id?: string
  deadline?: string
  created_at: string
  updated_at: string
}

export interface LogEntry {
  id: string
  decision_id?: string
  ref: string
  title: string
  status: LogStatus
  description: string
  success_prob: number
  impact_delta: string
  reversibility: number
  tags: string[]
  logged_at: string
}

export interface AAR {
  id: string
  decision_id?: string
  status: AARStatus
  predicted_outcome?: number
  actual_outcome?: number
  calibration_delta?: number
  lessons?: string[]
  bias_scores?: Record<string, number>
  owner_id?: string
  due_at?: string
}

export interface DAMEntry {
  id: string
  decision_type: string
  authority_level: string
  threshold: string
  status: 'ACTIVE' | 'DELEGATED'
  auth_score: number
}

export interface ReversibilityDebt {
  id: string
  ref: string
  label: string
  debt_type: string
  severity: Severity
  amount: number
}

export interface Cluster {
  id: string
  name: string
  session_id?: string
  status: ClusterStatus
  description: string
  progress: number
  risk_level: string
  decision_id?: string
  agents: string[]
  humans: number
}

export interface ClusterMember {
  id: string
  cluster_id: string
  member_type: MemberType
  name: string
  role?: string
  load_pct: number
  status?: string
}

export interface FeedItem {
  id: string
  cluster_id?: string
  author: string
  author_type: MemberType
  content: string
  tags: string[]
  created_at: string
}

export interface Handoff {
  id: string
  cluster_id?: string
  from_name: string
  from_type: string
  to_name: string
  to_type: string
  content: string
  is_urgent: boolean
  status: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  operator_id: string
  clearance: number
}
