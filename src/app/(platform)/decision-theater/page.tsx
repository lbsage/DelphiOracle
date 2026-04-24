import Topbar from '@/components/layout/topbar'
import DecisionTheater from '@/components/decision-theater'

export default function DecisionTheaterPage() {
  return (
    <>
      <Topbar title="Decision Theater" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <DecisionTheater />
      </div>
    </>
  )
}
