use serde::{Deserialize, Serialize};
use crate::{
    gravity::{self, GravityResponse},
    authority::{self, AuthorityResponse},
    policy::{self, PolicyResponse},
    autonomy::{self, AutonomyResponse, AutonomyRequest},
};

/// Single-call input that spans all four pipeline stages.
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GatewayRequest {
    pub decision_id: String,
    pub domain: String,
    pub decision_type: String,
    pub current_actor_authority: String,

    // Gravity inputs (0.0–1.0 each)
    pub impact: f64,
    pub urgency: f64,
    pub uncertainty: f64,
    pub irreversibility: f64,
    pub visibility: f64,

    // Autonomy inputs (0.0–1.0 each)
    pub confidence: f64,
    pub reversibility: f64,
    pub trust: f64,

    // Authority input
    pub cost_exposure: f64,

    // Boolean flags shared across stages
    pub ethical_flag: bool,
    pub regulated_domain: bool,
    pub irreversible_action: bool,
    pub after_hours: bool,
    pub incident_mode: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GatewayResponse {
    pub decision_id: String,
    pub policy: PolicyResponse,
    pub gravity: GravityResponse,
    pub authority: AuthorityResponse,
    pub autonomy: AutonomyResponse,
}

/// Orchestrates the full decision pipeline in order:
///   Policy (thresholds) → Gravity (score) → Authority (who) → Autonomy (route)
///
/// Outputs of earlier stages feed later stages — gravity_band → authority,
/// authority_factor + policy thresholds → autonomy.
pub fn evaluate(req: GatewayRequest) -> GatewayResponse {
    // ── 1. Policy — establish thresholds and hard-block rules ─────────────
    let policy_res = policy::evaluate(policy::PolicyRequest {
        decision_id:        req.decision_id.clone(),
        domain:             req.domain.clone(),
        decision_type:      req.decision_type.clone(),
        regulated_domain:   req.regulated_domain,
        after_hours:        req.after_hours,
        incident_mode:      req.incident_mode,
        ethical_flag:       req.ethical_flag,
        irreversible_action: req.irreversible_action,
        gravity_hint:       None, // resolved after gravity stage
    });

    // ── 2. Gravity — compute score and band ───────────────────────────────
    let gravity_res = gravity::evaluate(gravity::GravityRequest {
        decision_id:    req.decision_id.clone(),
        impact:         req.impact,
        urgency:        req.urgency,
        uncertainty:    req.uncertainty,
        irreversibility: req.irreversibility,
        visibility:     req.visibility,
    });

    // ── 3. Authority — determine who must approve ─────────────────────────
    let authority_res = authority::evaluate(authority::AuthorityRequest {
        decision_id:              req.decision_id.clone(),
        domain:                   req.domain.clone(),
        decision_type:            req.decision_type.clone(),
        gravity_band:             gravity_res.gravity_band.clone(),
        cost_exposure:            req.cost_exposure,
        current_actor_authority:  req.current_actor_authority.clone(),
        ethical_flag:             req.ethical_flag,
        regulated_domain:         req.regulated_domain,
    });

    // ── 4. Autonomy — decide route (BLOCK / ESCALATE / AUTO_EXECUTE / HUMAN_APPROVAL_REQUIRED)
    let autonomy_res = autonomy::evaluate(AutonomyRequest {
        decision_id:              req.decision_id.clone(),
        confidence:               req.confidence,
        reversibility:            req.reversibility,
        trust:                    req.trust,
        authority_factor:         authority_res.current_authority_factor,
        gravity:                  gravity_res.gravity_score,
        base_threshold:           policy_res.base_threshold,
        threshold_modifiers:      policy_res.threshold_modifiers.clone(),
        current_actor_authority:  req.current_actor_authority.clone(),
        required_authority:       authority_res.required_authority.clone(),
        ethical_flag:             req.ethical_flag,
        regulated_domain:         req.regulated_domain,
        irreversible_action:      req.irreversible_action,
        visibility:               Some(req.visibility),
    });

    GatewayResponse {
        decision_id: req.decision_id,
        policy:      policy_res,
        gravity:     gravity_res,
        authority:   authority_res,
        autonomy:    autonomy_res,
    }
}
