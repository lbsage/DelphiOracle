import Topbar from '@/components/layout/topbar'
import Workspace from '@/components/workspace'

export default function WorkspacePage() {
  return (
    <>
      <Topbar title="Workspace" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Workspace />
      </div>
    </>
  )
}
