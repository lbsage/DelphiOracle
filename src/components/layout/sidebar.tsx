'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { C, NAV } from '@/lib/constants'
import { Dot } from '@/components/ui'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div style={{
      width: 210, flexShrink: 0, background: C.card,
      borderRight: `1px solid ${C.border}`, display: 'flex',
      flexDirection: 'column', height: '100%',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: C.orange, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>Δ</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.06em' }}>DELPHI</div>
            <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
              Decision OS v2.0
            </div>
          </div>
        </div>
      </div>

      {/* Operator */}
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3, fontFamily: "'Space Mono', monospace" }}>Operator</div>
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 1 }}>ANALYST_D1</div>
        <div style={{ fontSize: 10, color: C.cyan, fontFamily: "'Space Mono', monospace" }}>Level 5 Clearance</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 10px', borderRadius: 5, marginBottom: 1, cursor: 'pointer',
                background: active ? `${C.orange}18` : 'transparent',
                color: active ? C.orange : C.text2,
                borderLeft: active ? `2px solid ${C.orange}` : '2px solid transparent',
                fontSize: 12, fontWeight: active ? 600 : 400, transition: 'all 0.12s',
              }}>
                <span style={{ fontSize: 13, width: 16, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Status */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {([['DB_SYNC ACTIVE', C.green, true], ['KERNEL V4.8.1', C.cyan, false], ['REASONING: 100%', C.orange, false]] as const).map(([t, c, p]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dot color={c} pulse={p} />
            <span style={{ fontSize: 9, color: C.text3, fontFamily: "'Space Mono', monospace" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
