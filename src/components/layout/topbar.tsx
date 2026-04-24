'use client'
import { C } from '@/lib/constants'

export default function Topbar({ title, crumb }: { title: string; crumb?: string }) {
  return (
    <div style={{
      height: 50, borderBottom: `1px solid ${C.border}`, display: 'flex',
      alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0, background: C.card,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        {crumb && <span style={{ fontSize: 11, color: C.text3, fontFamily: "'Space Mono', monospace" }}>{crumb}</span>}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', background: C.card2,
        border: `1px solid ${C.border}`, borderRadius: 4, padding: '5px 10px', gap: 7, width: 180,
      }}>
        <span style={{ color: C.text3, fontSize: 12 }}>⌕</span>
        <span style={{ fontSize: 11, color: C.text3 }}>Search parameters...</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: 15, color: C.text2 }}>🔔</span>
          <div style={{
            position: 'absolute', top: -3, right: -3, background: C.red, borderRadius: '50%',
            width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700, color: '#fff',
          }}>3</div>
        </div>
        <span style={{ fontSize: 14, color: C.text2, cursor: 'pointer' }}>⚙</span>
        <div style={{
          width: 26, height: 26, borderRadius: '50%', background: C.orange,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff', cursor: 'pointer',
        }}>JD</div>
      </div>
    </div>
  )
}
