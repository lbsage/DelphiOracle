// TypeScript mirror of crates/common — identical formulas, same field names.
// Used by the Next.js API route as a fallback when the Rust gateway is unavailable.

export interface GravityInput {
  decision_id: string
  impact: number          // 0.0–1.0
  urgency: number
  uncertainty: number
  irreversibility: number
  visibility: number      // divisor — low visibility amplifies gravity
}

export interface GravityOutput {
  decision_id: string
  gravity_score: number
  gravity_band: 'high' | 'medium' | 'low'
  explanation: string[]
}

export interface AuthorityInput {
  decision_id: string
  domain: string
  decision_type: string
  gravity_band: string
  cost_exposure: number
  current_actor_authority: string
  ethical_flag: boolean
  regulated_domain: boolean
}

export interface AuthorityOutput {
  decision_id: string
  required_authority: string
  current_actor_authority: string
  current_authority_factor: number
  required_authority_factor: number
  can_auto_execute: boolean
  escalation_target: string | null
  reason_codes: string[]
  explanation: string
}

export interface ThresholdModifiers {
  regulated_domain: number
  after_hours: number
  incident_mode: number
}

export interface PolicyInput {
  decision_id: string
  domain: string
  decision_type: string
  regulated_domain: boolean
  after_hours: boolean
  incident_mode: boolean
  ethical_flag: boolean
  irreversible_action: boolean
  gravity_hint?: number
}

export interface PolicyOutput {
  decision_id: string
  base_threshold: number
  threshold_modifiers: ThresholdModifiers
  hard_block_rules: string[]
  never_autonomous: boolean
  explanation: string
}

export interface AutonomyInput {
  decision_id: string
  confidence: number
  reversibility: number
  trust: number
  authority_factor: number
  gravity: number
  base_threshold: number
  threshold_modifiers: ThresholdModifiers
  current_actor_authority: string
  required_authority: string
  ethical_flag: boolean
  regulated_domain: boolean
  irreversible_action: boolean
  visibility?: number
}

export type AutonomyRoute = 'BLOCK' | 'ESCALATE' | 'AUTO_EXECUTE' | 'HUMAN_APPROVAL_REQUIRED'

export interface AutonomyOutput {
  decision_id: string
  autonomy_score: number
  effective_threshold: number
  route: AutonomyRoute
  reason_codes: string[]
  explanation: string
}

export interface GatewayInput {
  decision_id: string
  domain: string
  decision_type: string
  current_actor_authority: 'operator' | 'manager' | 'executive'
  impact: number
  urgency: number
  uncertainty: number
  irreversibility: number
  visibility: number
  confidence: number
  reversibility: number
  trust: number
  cost_exposure: number
  ethical_flag: boolean
  regulated_domain: boolean
  irreversible_action: boolean
  after_hours: boolean
  incident_mode: boolean
}

export interface GatewayOutput {
  decision_id: string
  policy: PolicyOutput
  gravity: GravityOutput
  authority: AuthorityOutput
  autonomy: AutonomyOutput
  source?: 'rust' | 'typescript'
}

// ── Gravity ───────────────────────────────────────────────────────────────────
function computeGravityScore(req: GravityInput): number {
  const visibility = Math.max(req.visibility, 0.1)
  const raw = (req.impact * req.urgency * req.uncertainty * req.irreversibility) / visibility
  return Math.round(Math.min(raw, 1.0) * 10_000) / 10_000
}

function gravityBand(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.75) return 'high'
  if (score >= 0.40) return 'medium'
  return 'low'
}

function gravityExplain(req: GravityInput, score: number): string[] {
  const notes: string[] = []
  if (req.impact >= 0.7)          notes.push('High impact')
  if (req.urgency >= 0.7)         notes.push('High urgency')
  if (req.uncertainty >= 0.6)     notes.push('Elevated uncertainty')
  if (req.irreversibility >= 0.7) notes.push('High irreversibility')
  if (req.visibility <= 0.4)      notes.push('Low visibility amplified score')
  if (!notes.length)              notes.push('Moderate composite decision gravity')
  notes.push(`Composite score: ${score.toFixed(4)}`)
  return notes
}

export function evaluateGravity(req: GravityInput): GravityOutput {
  const score = computeGravityScore(req)
  return {
    decision_id: req.decision_id,
    gravity_score: score,
    gravity_band: gravityBand(score),
    explanation: gravityExplain(req, score),
  }
}

// ── Authority ─────────────────────────────────────────────────────────────────
function authorityFactor(level: string): number {
  return ({ operator: 0.35, manager: 0.60, executive: 0.90 } as Record<string, number>)[level] ?? 0
}

function escalationTarget(level: string): string | null {
  if (level === 'operator') return 'manager_on_call'
  if (level === 'manager')  return 'executive_sponsor'
  return null
}

function determineRequired(req: AuthorityInput): string {
  if (req.ethical_flag) return 'executive'
  if (req.regulated_domain && (req.gravity_band === 'medium' || req.gravity_band === 'high')) return 'executive'
  if (req.gravity_band === 'high')    return 'executive'
  if (req.gravity_band === 'medium')  return 'manager'
  if (req.cost_exposure >= 250_000)   return 'manager'
  return 'operator'
}

export function evaluateAuthority(req: AuthorityInput): AuthorityOutput {
  const required        = determineRequired(req)
  const current         = req.current_actor_authority
  const currentFactor   = authorityFactor(current)
  const requiredFactor  = authorityFactor(required)

  const reasons: string[] = []
  if (req.ethical_flag)              reasons.push('ETHICAL_REVIEW_REQUIRED')
  if (req.regulated_domain)          reasons.push('REGULATED_DOMAIN')
  if (req.gravity_band === 'high')   reasons.push('HIGH_GRAVITY')
  if (req.cost_exposure >= 250_000)  reasons.push('HIGH_COST_EXPOSURE')
  if (!reasons.length)               reasons.push('WITHIN_STANDARD_AUTHORITY')

  const canAutoExecute = currentFactor >= requiredFactor && required !== 'executive'
  const target = currentFactor < requiredFactor ? escalationTarget(current) : null

  const explanation = currentFactor < requiredFactor
    ? `Decision exceeds ${current} authority and requires ${required} review.`
    : canAutoExecute
      ? `Decision is within ${current} authority and may proceed to autonomy evaluation.`
      : `Decision is within ${required} governance scope but is not auto-executable by policy.`

  return {
    decision_id: req.decision_id,
    required_authority: required,
    current_actor_authority: current,
    current_authority_factor: currentFactor,
    required_authority_factor: requiredFactor,
    can_auto_execute: canAutoExecute,
    escalation_target: target,
    reason_codes: reasons,
    explanation,
  }
}

// ── Policy ────────────────────────────────────────────────────────────────────
export function evaluatePolicy(req: PolicyInput): PolicyOutput {
  const baseMap: Record<string, number> = { strategic: 0.85, financial: 0.80, operational: 0.70 }
  const base_threshold = baseMap[req.decision_type] ?? 0.75

  const threshold_modifiers: ThresholdModifiers = {
    regulated_domain: req.regulated_domain ? 1.15 : 1.0,
    after_hours:      req.after_hours      ? 1.05 : 1.0,
    incident_mode:    req.incident_mode    ? 0.90 : 1.0,
  }

  const hard_block_rules: string[] = []
  let never_autonomous = false

  if (req.ethical_flag) {
    hard_block_rules.push('ETHICAL_REVIEW_REQUIRED')
    never_autonomous = true
  }
  if (req.regulated_domain && req.irreversible_action) {
    hard_block_rules.push('REGULATED_IRREVERSIBLE_ACTION')
    never_autonomous = true
  }
  if (req.gravity_hint && req.gravity_hint > 0.85 && req.irreversible_action) {
    hard_block_rules.push('HIGH_GRAVITY_IRREVERSIBLE_ACTION')
    never_autonomous = true
  }

  return {
    decision_id: req.decision_id,
    base_threshold,
    threshold_modifiers,
    hard_block_rules,
    never_autonomous,
    explanation: never_autonomous
      ? 'Policy requires human review for this class of action.'
      : 'Policy returned threshold and modifiers for autonomy evaluation.',
  }
}

// ── Autonomy ──────────────────────────────────────────────────────────────────
function authorityOrder(level: string): number {
  return ({ operator: 1, manager: 2, executive: 3 } as Record<string, number>)[level] ?? 0
}

function effectiveThreshold(req: AutonomyInput): number {
  const t = req.base_threshold
    * req.threshold_modifiers.regulated_domain
    * req.threshold_modifiers.after_hours
    * req.threshold_modifiers.incident_mode
  return Math.round(t * 10_000) / 10_000
}

function computeAutonomyScore(req: AutonomyInput): number {
  const raw = (req.confidence * req.reversibility * req.trust * req.authority_factor)
    / Math.max(req.gravity, 0.05)
  return Math.round(Math.min(raw, 2.0) * 10_000) / 10_000
}

function hardBlocks(req: AutonomyInput): string[] {
  const out: string[] = []
  if (req.ethical_flag)                                  out.push('ETHICAL_REVIEW_REQUIRED')
  if (req.regulated_domain && req.irreversible_action)   out.push('REGULATED_IRREVERSIBLE_ACTION')
  if (req.gravity > 0.85 && req.irreversible_action)     out.push('HIGH_GRAVITY_IRREVERSIBLE_ACTION')
  return out
}

export function evaluateAutonomy(req: AutonomyInput): AutonomyOutput {
  const threshold = effectiveThreshold(req)
  const score     = computeAutonomyScore(req)
  const blocks    = hardBlocks(req)

  if (blocks.length) return {
    decision_id: req.decision_id, autonomy_score: score, effective_threshold: threshold,
    route: 'BLOCK', reason_codes: blocks,
    explanation: 'Policy blocked autonomous execution — irreversible or ethically sensitive action.',
  }
  if (authorityOrder(req.current_actor_authority) < authorityOrder(req.required_authority)) return {
    decision_id: req.decision_id, autonomy_score: score, effective_threshold: threshold,
    route: 'ESCALATE', reason_codes: ['AUTHORITY_BELOW_REQUIRED_TIER'],
    explanation: 'Current actor authority is below the required approval tier.',
  }
  if (score >= threshold) return {
    decision_id: req.decision_id, autonomy_score: score, effective_threshold: threshold,
    route: 'AUTO_EXECUTE', reason_codes: ['SCORE_ABOVE_THRESHOLD'],
    explanation: 'Decision cleared the autonomy threshold and may execute automatically.',
  }
  return {
    decision_id: req.decision_id, autonomy_score: score, effective_threshold: threshold,
    route: 'HUMAN_APPROVAL_REQUIRED', reason_codes: ['SCORE_BELOW_THRESHOLD'],
    explanation: 'Decision did not clear the autonomy threshold — human approval required.',
  }
}

// ── Gateway — orchestrates all four stages ────────────────────────────────────
export function evaluateGateway(req: GatewayInput): GatewayOutput {
  const policy = evaluatePolicy({
    decision_id: req.decision_id, domain: req.domain, decision_type: req.decision_type,
    regulated_domain: req.regulated_domain, after_hours: req.after_hours,
    incident_mode: req.incident_mode, ethical_flag: req.ethical_flag,
    irreversible_action: req.irreversible_action,
  })

  const gravity = evaluateGravity({
    decision_id: req.decision_id,
    impact: req.impact, urgency: req.urgency,
    uncertainty: req.uncertainty, irreversibility: req.irreversibility,
    visibility: req.visibility,
  })

  const authority = evaluateAuthority({
    decision_id: req.decision_id, domain: req.domain, decision_type: req.decision_type,
    gravity_band: gravity.gravity_band, cost_exposure: req.cost_exposure,
    current_actor_authority: req.current_actor_authority,
    ethical_flag: req.ethical_flag, regulated_domain: req.regulated_domain,
  })

  const autonomy = evaluateAutonomy({
    decision_id: req.decision_id,
    confidence: req.confidence, reversibility: req.reversibility,
    trust: req.trust, authority_factor: authority.current_authority_factor,
    gravity: gravity.gravity_score, base_threshold: policy.base_threshold,
    threshold_modifiers: policy.threshold_modifiers,
    current_actor_authority: req.current_actor_authority,
    required_authority: authority.required_authority,
    ethical_flag: req.ethical_flag, regulated_domain: req.regulated_domain,
    irreversible_action: req.irreversible_action, visibility: req.visibility,
  })

  return { decision_id: req.decision_id, policy, gravity, authority, autonomy }
}

// ── UI helpers ────────────────────────────────────────────────────────────────

/** Map engine route → legacy 3-way routing label for existing UI components */
export function routeToRouting(route: AutonomyRoute): 'ACT' | 'ESCALATE' | 'DEFER' {
  if (route === 'AUTO_EXECUTE')             return 'ACT'
  if (route === 'ESCALATE' || route === 'BLOCK') return 'ESCALATE'
  return 'DEFER' // HUMAN_APPROVAL_REQUIRED
}

export const ROUTE_META: Record<AutonomyRoute, { label: string; color: string; desc: string }> = {
  AUTO_EXECUTE:             { label: 'AUTO-EXECUTE',       color: '#00e87a', desc: 'Score cleared threshold. May execute autonomously.' },
  HUMAN_APPROVAL_REQUIRED:  { label: 'HUMAN APPROVAL',     color: '#ffaa00', desc: 'Score below threshold. Requires human sign-off.' },
  ESCALATE:                 { label: 'ESCALATE ↑',         color: '#ff3545', desc: 'Actor authority below required tier.' },
  BLOCK:                    { label: 'BLOCKED',             color: '#ff3545', desc: 'Hard policy block. Human review mandatory.' },
}
