// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/landing/Footer'
import Header from '@components/layout/landing/Header'
import { useConfig } from '@/context/configContext'

// Server Action Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const FrontLayout = ({ children }: ChildrenType) => {
  // Vars
  const mode = getSystemMode()
  const { config } = useConfig()

  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} />
      {children}
      <Footer hideFooter={config.hideFooter} />
    </div>
  )
}

export default FrontLayout
