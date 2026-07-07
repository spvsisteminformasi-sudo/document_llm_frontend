'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import HeroSection from './components/HeroSection'
import UsefulFeature from './components/UsefulFeature'
import CustomerReviews from './components/CustomerReviews'
// import OurTeam from './OurTeam'
// import Pricing from './Pricing'
import ProductStat from './components/ProductStat'
import Faqs from './components/Faqs'
// import GetStarted from './GetStarted'
import ContactUs from './components/ContactUs'
import { useSettings } from '@core/hooks/useSettings'
import { getMode } from '@/@core/utils/serverHelpers'
import Head from 'next/head'
import { useTitle } from '@/hooks/useTitle'
const LandingPageWrapper = () => {
  // Hooks
  useTitle('')
  const { updatePageSettings } = useSettings()
  const mode = getMode()
  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeroSection mode={mode} />
      <UsefulFeature />
      {/* <CustomerReviews />
      <ProductStat /> */}
      <Faqs />
    </>
  )
}

export default LandingPageWrapper
