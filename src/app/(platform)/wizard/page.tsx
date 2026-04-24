import Topbar from '@/components/layout/topbar'
import Wizard from '@/components/wizard'

export default function WizardPage() {
  return (
    <>
      <Topbar title="Wizard" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Wizard />
      </div>
    </>
  )
}
