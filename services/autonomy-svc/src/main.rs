use axum::{routing::post, Router, Json};
use common::autonomy::{AutonomyRequest, AutonomyResponse, evaluate};
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

async fn handle_evaluate(Json(req): Json<AutonomyRequest>) -> Json<AutonomyResponse> {
    Json(evaluate(req))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        .route("/evaluate", post(handle_evaluate))
        .layer(CorsLayer::permissive());

    let addr = "0.0.0.0:8013";
    tracing::info!("autonomy-svc listening on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
