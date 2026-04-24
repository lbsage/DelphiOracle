'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { C } from '@/lib/constants'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username } },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setLoading(false) }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.card, border: `1px solid ${C.green}44`, borderRadius: 10, padding: 40, maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.green, marginBottom: 8 }}>Account Created</div>
          <div style={{ fontSize: 13, color: C.text2, marginBottom: 24, lineHeight: 1.6 }}>Check your email to confirm your account, then sign in to access the platform.</div>
          <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: C.orange, color: '#fff', borderRadius: 5, textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>GO TO LOGIN →</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,85,0,0.10) 0%,transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(42,37,32,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(42,37,32,0.3) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, background: C.orange, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>Δ</div>
            <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: '0.06em' }}>DELPHI</div>
          </div>
          <div style={{ fontSize: 14, color: C.text2 }}>Create your operator account</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 36 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Join the platform.</div>
          <div style={{ fontSize: 13, color: C.text2, marginBottom: 28, lineHeight: 1.6 }}>Free tier includes core decision loop and reasoning agents.</div>

          <form onSubmit={handleSignup}>
            {error && (
              <div style={{ padding: '10px 14px', background: `${C.red}14`, border: `1px solid ${C.red}44`, borderRadius: 5, marginBottom: 16, fontSize: 12, color: C.red }}>{error}</div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Operator Handle</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="ANALYST_01"
                style={{ width: '100%', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 5, padding: '10px 14px', color: C.text1, fontSize: 13, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="operator@org.io"
                style={{ width: '100%', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 5, padding: '10px 14px', color: C.text1, fontSize: 13, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 10, color: C.text3, fontFamily: "'Space Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Min 8 characters"
                style={{ width: '100%', background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 5, padding: '10px 14px', color: C.text1, fontSize: 13, outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 20px', background: C.orange, color: '#fff', border: 'none', borderRadius: 5, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: "'Space Grotesk',sans-serif" }}>
              {loading ? '⟳ CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.text3 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: C.orange, textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {[['Free', C.green, 'Core decision loop, reasoning agents, Decision Wizard.'],
              ['PRO', C.orange, 'Structured authority, attention allocation, Decision Theater.'],
              ['Enterprise', C.purple, 'Full governance, Executive Mission Control, S3 learning.']].map(([tier, color, desc]) => (
              <div key={tier as string} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 11, color: C.text2, lineHeight: 1.45, alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: color as string, flexShrink: 0, marginTop: 4 }} />
                <span><strong style={{ color: C.text1 }}>{tier as string}</strong> — {desc as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
