import Topbar from '@/components/layout/topbar'
import MissionControl from '@/components/mission-control'

export default function MissionControlPage() {
  return (
    <>
      <Topbar title="Mission Control" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <MissionControl />
      </div>
    </>
  )
}
