'use client'
import { useState } from 'react'
import { C } from '@/lib/constants'

// ── Badge ──────────────────────────────────────────────────────────────────
export const Badge = ({ children, color = C.text3 }: { children: React.ReactNode; color?: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '2px 7px',
    borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', border: `1px solid ${color}44`,
    color, background: `${color}14`, fontFamily: "'Space Mono', monospace", lineHeight: '16px',
  }}>{children}</span>
)

// ── Dot ────────────────────────────────────────────────────────────────────
export const Dot = ({ color, pulse }: { color: string; pulse?: boolean }) => (
  <span style={{
    width: 6, height: 6, borderRadius: '50%', background: color,
    display: 'inline-block', flexShrink: 0,
    boxShadow: pulse ? `0 0 0 3px ${color}30` : undefined,
  }} />
)

// ── Card ───────────────────────────────────────────────────────────────────
export const Card = ({
  children, style, onClick, className,
}: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; className?: string }) => {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={className}
      style={{
        background: C.card, border: `1px solid ${hov && onClick ? C.border2 : C.border}`,
        borderRadius: 6, padding: 14, cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.12s', ...style,
      }}
    >{children}</div>
  )
}

// ── SLabel ─────────────────────────────────────────────────────────────────
export const SLabel = ({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text3, fontFamily: "'Space Mono', monospace" }}>{children}</span>
    {right}
  </div>
)

// ── Bar ────────────────────────────────────────────────────────────────────
export const Bar = ({ value, color = C.cyan, h = 4, style }: { value: number; color?: string; h?: number; style?: React.CSSProperties }) => (
  <div style={{ background: C.border, borderRadius: 2, height: h, overflow: 'hidden', ...style }}>
    <div style={{ width: `${Math.min(100, value)}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
  </div>
)

// ── Btn ────────────────────────────────────────────────────────────────────
export const Btn = ({
  children, onClick, primary, sm, style, full, disabled,
}: { children: React.ReactNode; onClick?: () => void; primary?: boolean; sm?: boolean; style?: React.CSSProperties; full?: boolean; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: primary ? C.orange : 'transparent',
      color: primary ? '#fff' : C.text2,
      border: `1px solid ${primary ? C.orange : C.border2}`,
      borderRadius: 4, padding: sm ? '4px 11px' : '7px 14px',
      fontSize: sm ? 10 : 11, fontWeight: 700, letterSpacing: '0.07em',
      textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'opacity 0.12s', width: full ? '100%' : undefined,
      fontFamily: "'Space Mono', monospace", opacity: disabled ? 0.5 : 1, ...style,
    }}
  >{children}</button>
)

// ── MiniChart ──────────────────────────────────────────────────────────────
export const MiniChart = ({ points, color, height = 50, fill }: { points: number[]; color: string; height?: number; fill?: boolean }) => {
  const w = 220, h = height, pad = 4
  const min = Math.min(...points), max = Math.max(...points), range = max - min || 1
  const pts = points.map((v, i) => `${pad + i * (w - pad * 2) / (points.length - 1)},${h - pad - (v - min) / range * (h - pad * 2)}`).join(' ')
  const gId = `g${color.replace('#', '')}`
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && (
        <defs>
          <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && (
        <polygon
          points={`${pts} ${pad + (points.length - 1) * (w - pad * 2) / (points.length - 1)},${h} ${pad},${h}`}
          fill={`url(#${gId})`}
        />
      )}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── RouteBadge ─────────────────────────────────────────────────────────────
export const RouteBadge = ({ r }: { r: string }) => {
  const m: Record<string, [string, string]> = {
    ESCALATE: [C.red, 'ESCALATE ↑'],
    ACT:      [C.green, 'ACT NOW'],
    DEFER:    [C.text3, 'DEFER'],
  }
  const [c, l] = m[r] ?? [C.text3, r]
  return <Badge color={c}>{l}</Badge>
}
