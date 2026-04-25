use axum::{routing::post, Router, Json};
use common::gravity::{GravityRequest, GravityResponse, evaluate};
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

async fn handle_evaluate(Json(req): Json<GravityRequest>) -> Json<GravityResponse> {
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

    let addr = "0.0.0.0:8011";
    tracing::info!("gravity-svc listening on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
