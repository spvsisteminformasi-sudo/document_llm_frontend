'use client'
// React Imports
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import {
  TextField,
  IconButton
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'

// Next Imports

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Wave from '@core/svg/Wave'
import PedomanText from '@assets/png/PedomanText'

// Hook Imports

// Styles Imports
import frontCommonStyles from './styles.module.css'
import { useTranslations } from 'next-intl'

const HeroSection = ({ mode }: { mode: Mode }) => {
  // States
  const t = useTranslations('HomePage');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateMousePosition = (ev: MouseEvent) => {
        const x = ev.clientX
        const y = ev.clientY
      }

      window.addEventListener('mousemove', updateMousePosition)

      return () => {
        window.removeEventListener('mousemove', updateMousePosition)
      }
    }
  }, [])

  const router = useRouter()
  const [question, setQuestion] = useState('')

  const handleSearch = () => {
    if (!question.trim()) return
    // Navigasi ke halaman QA dengan query
    router.push(`/qa-document?q=${encodeURIComponent(question)}`)
  }

  return (
    <>
      <section id='home' className='overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]' >
        <div className='absolute -bottom-16 left-0 right-0 w-full overflow-hidden'>
          <Wave />
          <div className='pointer-events-none absolute bottom-0 left-0 right-0 mx-auto h-24 select-none bg-gradient-to-t from-white from-0% via-white/70 via-30% to-transparent to-100%'>
          </div>
        </div>
        <div className={classnames('pbs-16 overflow-hidden', frontCommonStyles.layoutSpacing)}>
          <div className='md:max-is-[550px] mlb-0 mli-auto text-center'>
            {/* <MaterializeLogo width='100%' height={128} /> */}
            <PedomanText width='100%' height={128} />
            <Typography className='font-extrabold text-primary sm:text-[38px] text-3xl mbe-4 leading-[44px]'>
              {t('title')}
            </Typography>
            <Typography className='font-extrabold text-warning sm:text-[19px] text-2xl mbe-4 leading-[32px]'>
              {t('subtitle')}
            </Typography>
            <Typography className='font-medium' color='text.primary'>
              {t('description')}
            </Typography>
            <div className='mbs-8'>
              {/* <Button
							component={Link}
							href='/'
							variant='contained'
							color='primary'
							size='large'
						>
							Search
						</Button> */}
              <TextField
                className='is-full sm:max-is-[55%] md:max-is-[600px]'
                variant='outlined'
                placeholder='Ask a question...'
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '36px',
                    backgroundColor: '#ffffff'
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '1rem 2rem !important'
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          edge='end'
                          onClick={handleSearch}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={'ri-search-line text-primary'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
