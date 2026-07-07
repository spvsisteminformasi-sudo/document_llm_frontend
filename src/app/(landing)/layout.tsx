'use client'
// MUI Imports
import Button from '@mui/material/Button'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports
import { IntersectionProvider } from '@/context/intersectionContext'
import { ConfigProvider } from '@/context/configContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/landing'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'
import Head from 'next/head'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { Suspense } from 'react'
import Spinner from '@/@core/spinner'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children }: ChildrenType) => {
  // Vars
  const systemMode = getSystemMode()

  return (
    <Suspense fallback={<Spinner />}>
      <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
      <Providers direction='ltr'>
        <ConfigProvider>
          <BlankLayout systemMode={systemMode}>
            <IntersectionProvider>
              <FrontLayout>
                {children}
                <Toaster position="top-right" reverseOrder={false} />
                <ScrollToTop className='mui-fixed'>
                  <Button
                    variant='contained'
                    className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
                  >
                    <i className='ri-arrow-up-line' />
                  </Button>
                </ScrollToTop>
              </FrontLayout>
            </IntersectionProvider>
          </BlankLayout>
        </ConfigProvider>
      </Providers>
    </Suspense>
  )
}

export default Layout
