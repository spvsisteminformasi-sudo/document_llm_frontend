'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const Forbidden = ({ mode }: { mode: Mode }) => {
  // Vars
  const darkImg = '/images/pages/misc-mask-1-dark.png'
  const lightImg = '/images/pages/misc-mask-1-light.png'

  // Hooks
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center gap-10'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            401
          </Typography>
          <Typography variant='h4'>You are not authorized! 🔐</Typography>
          <Typography>You don&prime;t have permission to access this page. Go Home!</Typography>
        </div>
        <img
          alt='error-illustration'
          src='/images/illustrations/characters/3.png'
          className='object-cover bs-[300px] md:bs-[350px] lg:bs-[400px]'
        />
        <Button href='/' component={Link} variant='contained'>
          Back to Home
        </Button>
      </div>
      <img src={miscBackground} className='absolute bottom-0 z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default Forbidden
