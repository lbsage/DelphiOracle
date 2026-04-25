use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PolicyRequest {
    pub decision_id: String,
    pub domain: String,
    pub decision_type: String,
    pub regulated_domain: bool,
    pub after_hours: bool,
    pub incident_mode: bool,
    pub ethical_flag: bool,
    pub irreversible_action: bool,
    pub gravity_hint: Option<f64>,
}

/// Shared by both PolicyResponse and AutonomyRequest so modifiers
/// flow through the pipeline without struct duplication.
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ThresholdModifiers {
    pub regulated_domain: f64,
    pub after_hours: f64,
    pub incident_mode: f64,
}

impl Default for ThresholdModifiers {
    fn default() -> Self {
        Self { regulated_domain: 1.0, after_hours: 1.0, incident_mode: 1.0 }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PolicyResponse {
    pub decision_id: String,
    pub base_threshold: f64,
    pub threshold_modifiers: ThresholdModifiers,
    pub hard_block_rules: Vec<String>,
    pub never_autonomous: bool,
    pub explanation: String,
}

pub fn evaluate(req: PolicyRequest) -> PolicyResponse {
    let base_threshold = match req.decision_type.as_str() {
        "strategic"   => 0.85,
        "financial"   => 0.80,
        "operational" => 0.70,
        _             => 0.75,
    };

    let modifiers = ThresholdModifiers {
        regulated_domain: if req.regulated_domain { 1.15 } else { 1.0 },
        after_hours:      if req.after_hours      { 1.05 } else { 1.0 },
        incident_mode:    if req.incident_mode    { 0.90 } else { 1.0 },
    };

    let mut hard_block_rules = Vec::new();
    let mut never_autonomous = false;

    if req.ethical_flag {
        hard_block_rules.push("ETHICAL_REVIEW_REQUIRED".to_string());
        never_autonomous = true;
    }
    if req.regulated_domain && req.irreversible_action {
        hard_block_rules.push("REGULATED_IRREVERSIBLE_ACTION".to_string());
        never_autonomous = true;
    }
    if let Some(g) = req.gravity_hint {
        if g > 0.85 && req.irreversible_action {
            hard_block_rules.push("HIGH_GRAVITY_IRREVERSIBLE_ACTION".to_string());
            never_autonomous = true;
        }
    }

    let explanation = if never_autonomous {
        "Policy requires human review for this class of action.".to_string()
    } else {
        "Policy returned threshold and modifiers for autonomy evaluation.".to_string()
    };

    PolicyResponse {
        decision_id: req.decision_id,
        base_threshold,
        threshold_modifiers: modifiers,
        hard_block_rules,
        never_autonomous,
        explanation,
    }
}
