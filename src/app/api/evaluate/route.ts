import { NextRequest, NextResponse } from 'next/server'
import { evaluateGateway, type GatewayInput } from '@/lib/engine'

const GATEWAY_URL = process.env.GATEWAY_URL // e.g. http://localhost:8014

export async function POST(request: NextRequest) {
  const body = (await request.json()) as GatewayInput

  // Try the Rust gateway first if GATEWAY_URL is set
  if (GATEWAY_URL) {
    try {
      const res = await fetch(`${GATEWAY_URL}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000),
      })
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json({ ...data, source: 'rust' })
      }
    } catch {
      // Rust gateway unavailable — fall through to TypeScript engine
    }
  }

  const result = evaluateGateway(body)
  return NextResponse.json({ ...result, source: 'typescript' })
}
