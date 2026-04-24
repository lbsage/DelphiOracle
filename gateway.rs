use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AuthorityRequest {
    pub decision_id: String,
    pub domain: String,
    pub decision_type: String,
    pub gravity_band: String,
    pub cost_exposure: f64,
    pub current_actor_authority: String,
    pub ethical_flag: bool,
    pub regulated_domain: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AuthorityResponse {
    pub decision_id: String,
    pub required_authority: String,
    pub current_actor_authority: String,
    pub current_authority_factor: f64,
    pub required_authority_factor: f64,
    pub can_auto_execute: bool,
    pub escalation_target: Option<String>,
    pub reason_codes: Vec<String>,
    pub explanation: String,
}

pub fn authority_factor(level: &str) -> f64 {
    match level { "operator" => 0.35, "manager" => 0.60, "executive" => 0.90, _ => 0.0 }
}

fn escalation_target(level: &str) -> Option<String> {
    match level {
        "operator" => Some("manager_on_call".to_string()),
        "manager" => Some("executive_sponsor".to_string()),
        _ => None,
    }
}

pub fn determine_required_authority(req: &AuthorityRequest) -> &'static str {
    if req.ethical_flag { return "executive"; }
    if req.regulated_domain && (req.gravity_band == "medium" || req.gravity_band == "high") { return "executive"; }
    if req.gravity_band == "high" { return "executive"; }
    if req.gravity_band == "medium" { return "manager"; }
    if req.cost_exposure >= 250_000.0 { return "manager"; }
    "operator"
}

pub fn evaluate(req: AuthorityRequest) -> AuthorityResponse {
    let required = determine_required_authority(&req).to_string();
    let current = req.current_actor_authority.clone();
    let current_factor = authority_factor(&current);
    let required_factor = authority_factor(&required);

    let mut reason_codes = Vec::new();
    if req.ethical_flag { reason_codes.push("ETHICAL_REVIEW_REQUIRED".to_string()); }
    if req.regulated_domain { reason_codes.push("REGULATED_DOMAIN".to_string()); }
    if req.gravity_band == "high" { reason_codes.push("HIGH_GRAVITY".to_string()); }
    if req.cost_exposure >= 250_000.0 { reason_codes.push("HIGH_COST_EXPOSURE".to_string()); }

    let can_auto_execute = current_factor >= required_factor && required != "executive";
    let escalation_target = if current_factor >= required_factor { None } else { escalation_target(&current) };

    let explanation = if current_factor < required_factor {
        format!("Decision exceeds {current} authority and requires {required} review.")
    } else if can_auto_execute {
        format!("Decision is within {current} authority and may proceed to autonomy evaluation.")
    } else {
        format!("Decision remains within {required} governance scope but is not auto-executable by policy.")
    };

    AuthorityResponse {
        decision_id: req.decision_id,
        required_authority: required,
        current_actor_authority: current,
        current_authority_factor: current_factor,
        required_authority_factor: required_factor,
        can_auto_execute,
        escalation_target,
        reason_codes: if reason_codes.is_empty() { vec!["WITHIN_STANDARD_AUTHORITY".to_string()] } else { reason_codes },
        explanation,
    }
}
