import Topbar from '@/components/layout/topbar'
import Governance from '@/components/governance'

export default function GovernancePage() {
  return (
    <>
      <Topbar title="Governance" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Governance />
      </div>
    </>
  )
}
