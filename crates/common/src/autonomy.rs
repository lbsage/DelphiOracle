use serde::{Deserialize, Serialize};
use crate::policy::ThresholdModifiers; // reuse — no duplication

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AutonomyRequest {
    pub decision_id: String,
    pub confidence: f64,
    pub reversibility: f64,
    pub trust: f64,
    pub authority_factor: f64,
    pub gravity: f64,
    pub base_threshold: f64,
    #[serde(default)]
    pub threshold_modifiers: ThresholdModifiers,
    pub current_actor_authority: String,
    pub required_authority: String,
    pub ethical_flag: bool,
    pub regulated_domain: bool,
    pub irreversible_action: bool,
    pub visibility: Option<f64>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AutonomyResponse {
    pub decision_id: String,
    pub autonomy_score: f64,
    pub effective_threshold: f64,
    pub route: String,
    pub reason_codes: Vec<String>,
    pub explanation: String,
}

fn authority_order(level: &str) -> i32 {
    match level { "operator" => 1, "manager" => 2, "executive" => 3, _ => 0 }
}

pub fn effective_threshold(req: &AutonomyRequest) -> f64 {
    let t = req.base_threshold
        * req.threshold_modifiers.regulated_domain
        * req.threshold_modifiers.after_hours
        * req.threshold_modifiers.incident_mode;
    (t * 10_000.0).round() / 10_000.0
}

pub fn compute_autonomy_score(req: &AutonomyRequest) -> f64 {
    // High gravity suppresses autonomous execution; high confidence/reversibility/trust lifts it.
    let score = (req.confidence * req.reversibility * req.trust * req.authority_factor)
        / req.gravity.max(0.05);
    (score.min(2.0) * 10_000.0).round() / 10_000.0
}

fn hard_block(req: &AutonomyRequest) -> Vec<String> {
    let mut reasons = Vec::new();
    if req.ethical_flag {
        reasons.push("ETHICAL_REVIEW_REQUIRED".to_string());
    }
    if req.regulated_domain && req.irreversible_action {
        reasons.push("REGULATED_IRREVERSIBLE_ACTION".to_string());
    }
    if req.gravity > 0.85 && req.irreversible_action {
        reasons.push("HIGH_GRAVITY_IRREVERSIBLE_ACTION".to_string());
    }
    reasons
}

pub fn evaluate(req: AutonomyRequest) -> AutonomyResponse {
    let threshold     = effective_threshold(&req);
    let score         = compute_autonomy_score(&req);
    let block_reasons = hard_block(&req);

    if !block_reasons.is_empty() {
        return AutonomyResponse {
            decision_id: req.decision_id,
            autonomy_score: score,
            effective_threshold: threshold,
            route: "BLOCK".to_string(),
            reason_codes: block_reasons,
            explanation: "Policy blocked autonomous execution — irreversible or ethically sensitive action.".to_string(),
        };
    }

    if authority_order(&req.current_actor_authority) < authority_order(&req.required_authority) {
        return AutonomyResponse {
            decision_id: req.decision_id,
            autonomy_score: score,
            effective_threshold: threshold,
            route: "ESCALATE".to_string(),
            reason_codes: vec!["AUTHORITY_BELOW_REQUIRED_TIER".to_string()],
            explanation: "Current actor authority is below the required approval tier.".to_string(),
        };
    }

    if score >= threshold {
        return AutonomyResponse {
            decision_id: req.decision_id,
            autonomy_score: score,
            effective_threshold: threshold,
            route: "AUTO_EXECUTE".to_string(),
            reason_codes: vec!["SCORE_ABOVE_THRESHOLD".to_string()],
            explanation: "Decision cleared the autonomy threshold and may execute automatically.".to_string(),
        };
    }

    AutonomyResponse {
        decision_id: req.decision_id,
        autonomy_score: score,
        effective_threshold: threshold,
        route: "HUMAN_APPROVAL_REQUIRED".to_string(),
        reason_codes: vec!["SCORE_BELOW_THRESHOLD".to_string()],
        explanation: "Decision did not clear the autonomy threshold — human approval required.".to_string(),
    }
}
