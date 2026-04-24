# Delphi Decision Platform (Rust)

Rust-first microservices and gateway for Delphi:

Services:
- `gravity-svc`
- `authority-svc`
- `autonomy-svc`
- `policy-svc`
- `gateway-svc`

The gateway gives Delphi **one endpoint** to call:
- `POST /v1/decision/evaluate`

That endpoint orchestrates:
1. policy lookup
2. gravity scoring
3. authority evaluation
4. autonomy routing

## Run individual services

```bash
cargo run -p policy-svc
cargo run -p gravity-svc
cargo run -p authority-svc
cargo run -p autonomy-svc
cargo run -p gateway-svc
```

Ports:
- policy-svc: 8010
- gravity-svc: 8011
- authority-svc: 8012
- autonomy-svc: 8013
- gateway-svc: 8014

## Example

```bash
curl -X POST http://127.0.0.1:8014/v1/decision/evaluate \
  -H "Content-Type: application/json" \
  -d @examples/gateway-request.json
```
