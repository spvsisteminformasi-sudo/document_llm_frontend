'use client'
// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import GuestGuard from '@/@core/auth/GuestGuard'
import Spinner from '@/@core/spinner'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getSystemMode()

  return (
    <Suspense fallback={<Spinner />}>
      <Providers direction={direction}>
        <GuestGuard fallback={<Spinner />}>
          <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
          <Toaster position={'top-right'} toastOptions={{ className: 'react-hot-toast' }} />
        </GuestGuard>
      </Providers>
    </Suspense>
  )
}

export default Layout
