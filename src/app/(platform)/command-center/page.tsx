import Topbar from '@/components/layout/topbar'
import CommandCenter from '@/components/command-center'

export default function CommandCenterPage() {
  return (
    <>
      <Topbar title="Command Center" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <CommandCenter />
      </div>
    </>
  )
}
