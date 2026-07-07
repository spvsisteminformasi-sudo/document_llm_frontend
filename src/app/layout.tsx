'use client'
// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import Head from 'next/head'
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl'
import { useEffect, useState } from 'react'
import NextIntlProvider from '@/i18n/next-intl-provider'

const RootLayout = (props: ChildrenType) => {
  const { children } = props
  const [currentLocale, setCurrentLocale] = useState('en')
  // Vars

  const systemMode = getSystemMode()
  const direction = 'ltr'

  useEffect(() => {
    const storedLocale = localStorage.getItem('NEXT_LOCALE') || 'en'
    setCurrentLocale(storedLocale)
  }, [])

  return (
    <html id='__next' lang={currentLocale} dir={direction} suppressHydrationWarning>
      <Head>
        <title>Shiprule</title>
      </Head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <NextIntlProvider>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          {children}
        </NextIntlProvider>
      </body>
    </html>
  )
}

export default RootLayout
