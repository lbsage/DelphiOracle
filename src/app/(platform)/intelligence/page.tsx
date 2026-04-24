import Topbar from '@/components/layout/topbar'
import Intelligence from '@/components/intelligence'

export default function IntelligencePage() {
  return (
    <>
      <Topbar title="Intelligence" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Intelligence />
      </div>
    </>
  )
}
