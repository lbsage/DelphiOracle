use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GravityRequest {
    pub decision_id: String,
    pub impact: f64,
    pub urgency: f64,
    pub uncertainty: f64,
    pub irreversibility: f64,
    pub visibility: f64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GravityResponse {
    pub decision_id: String,
    pub gravity_score: f64,
    pub gravity_band: String,
    pub explanation: Vec<String>,
}

pub fn compute_gravity_score(req: &GravityRequest) -> f64 {
    let visibility = req.visibility.max(0.1);
    let score = (req.impact * req.urgency * req.uncertainty * req.irreversibility) / visibility;
    (score.min(1.0) * 10_000.0).round() / 10_000.0
}

pub fn gravity_band(score: f64) -> &'static str {
    if score >= 0.75 { "high" } else if score >= 0.40 { "medium" } else { "low" }
}

pub fn explain(req: &GravityRequest, score: f64) -> Vec<String> {
    let mut notes = Vec::new();
    if req.impact >= 0.7 { notes.push("High impact".to_string()); }
    if req.urgency >= 0.7 { notes.push("High urgency".to_string()); }
    if req.uncertainty >= 0.6 { notes.push("Elevated uncertainty".to_string()); }
    if req.irreversibility >= 0.7 { notes.push("High irreversibility".to_string()); }
    if req.visibility <= 0.4 { notes.push("Low visibility amplified score".to_string()); }
    if notes.is_empty() { notes.push("Moderate composite decision gravity".to_string()); }
    notes.push(format!("Composite score computed as {score:.4}"));
    notes
}

pub fn evaluate(req: GravityRequest) -> GravityResponse {
    let score = compute_gravity_score(&req);
    GravityResponse {
        decision_id: req.decision_id,
        gravity_score: score,
        gravity_band: gravity_band(score).to_string(),
        explanation: explain(&req, score),
    }
}
