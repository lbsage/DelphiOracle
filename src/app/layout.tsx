import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Delphi — Decision Intelligence Platform',
  description: 'The Decision OS for the agentic economy. Structure attention, assign authority, govern decisions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0e0c0b', color: '#f0ece6', height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
