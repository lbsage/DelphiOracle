'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { C } from '@/lib/constants'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0) // animate loop steps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/mission-control')
  }

  const LOOP = ['SENSE','FRAME','SIMULATE','JUDGE','ACT','OBSERVE','UPDATE']

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,85,0,0.12) 0%,transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,180,0.08) 0%,transparent 70%)', bottom: -100, left: -100, pointerEvents: 'none', filter: 'blur(60px)' }} />
      {/* Grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(42,37,32,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(42,37,32,0.3) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: C.orange, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>Δ</div>
            <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: '0.06em' }}>DELPHI</div>
          </div>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.14em', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', marginBottom: 16 }}>Decision OS v2.0</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {LOOP.map((s, i) => (
              <span key={s} style={{ fontSize: 8, fontFamily: "'Space Mono',monospace", padding: '3px 6px', borderRadius: 2, background: i === 2 ? `${C.orange}22` : C.border, color: i === 2 ? C.orange : C.text3, border: `1px solid ${i === 2 ? C.orange + '44' : 'transparent'}` }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 36 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Access the platform.</div>
          <div style={{ fontSize: 13, color: C.text2, marginBottom: 28, lineHeight: 1.6 }}>Sign in to your Decision OS workspace.</div>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ padding: '10px 14px', background: `${C.red}14`, border: `1px solid ${C.red}44`, borderRadius: 5, marginBottom: 16, fontSize: 12, color: C.red }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="operator@delphi.io"
                style={{ width: '100%', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 5, padding: '10px 14px', color: C.text1, fontSize: 13, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 10, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••••"
                style={{ width: '100%', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 5, padding: '10px 14px', color: C.text1, fontSize: 13, outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 20px', background: C.orange, color: '#fff', border: 'none', borderRadius: 5, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: "'Space Grotesk',sans-serif" }}>
              {loading ? '⟳ AUTHENTICATING...' : 'ENTER PLATFORM →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: C.text3, fontSize: 11 }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            or
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: C.text3 }}>
            No account?{' '}
            <Link href="/signup" style={{ color: C.orange, textDecoration: 'none', fontWeight: 600 }}>Create one →</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/mission-control" style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.text3, textDecoration: 'none', letterSpacing: '0.08em' }}>
            SKIP → CONTINUE AS GUEST
          </Link>
        </div>
      </div>
    </div>
  )
}
