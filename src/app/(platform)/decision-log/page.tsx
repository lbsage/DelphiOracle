import Topbar from '@/components/layout/topbar'
import DecisionLog from '@/components/decision-log'

export default function DecisionLogPage() {
  return (
    <>
      <Topbar title="Decision Log" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <DecisionLog />
      </div>
    </>
  )
}
