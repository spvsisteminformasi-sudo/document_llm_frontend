'use client'
// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import TransitionUp from '@assets/svg/front-pages/landing-page/TransitionUp'
import Edit from '@assets/svg/front-pages/landing-page/Edit'
import Cube from '@assets/svg/front-pages/landing-page/Cube'
import LifeBuoy from '@assets/svg/front-pages/landing-page/Lifebuoy'
import Document from '@assets/svg/front-pages/landing-page/Document'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from './styles.module.css'
import { useTranslations } from 'next-intl'

// Data

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  const t = useTranslations('HomePage.usefulFeature')
  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-gradient-to-b from-backgroundPaper to-background/50 pbs-24'>
      <div className={classnames('flex flex-col gap-12 plb-[100px]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center mbe-6 gap-3 animate-fade-in'>
            <Lines className="text-primary" />
            <Typography color='primary' className='font-medium uppercase tracking-wider'>
              {t('title')}
            </Typography>
          </div>
          <div className='flex items-center justify-center flex-wrap gap-2 mbe-4 text-center'>
            <Typography variant='h3' className='font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent'>
              {t('subtitle.part1')}
            </Typography>
            <Typography variant='h4'>{t('subtitle.part2')}</Typography>
          </div>
          <Typography className='font-medium text-center max-w-2xl mx-auto text-textSecondary'>
            {t('description')}
          </Typography>
        </div>
        <div>
          <Grid container columnSpacing={6} rowSpacing={12}>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className='flex flex-col gap-4 justify-center items-center p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1'>
                <div className={classnames('relative group', styles.featureIcon)}>
                  <div className='absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300' />
                  <div className='relative flex items-center border-2 border-primary/20 rounded-full p-5 is-[82px] bs-[82px] bg-background group-hover:border-primary transition-colors duration-300'>
                    <LaptopCharging className="text-primary" fontSize="large" />
                  </div>
                </div>
                <Typography variant='h5' className='font-semibold text-center'>
                  {t('features.search.title')}
                </Typography>
                <Typography className='max-w-[364px] text-center text-textSecondary'>
                  {t('features.search.description')}
                </Typography>
              </div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className='flex flex-col gap-4 justify-center items-center p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1'>
                <div className={classnames('relative group', styles.featureIcon)}>
                  <div className='absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300' />
                  <div className='relative flex items-center border-2 border-primary/20 rounded-full p-5 is-[82px] bs-[82px] bg-background group-hover:border-primary transition-colors duration-300'>
                    <Edit className="text-primary" fontSize="large" />
                  </div>
                </div>
                <Typography variant='h5' className='font-semibold text-center'>
                  {t('features.update.title')}
                </Typography>
                <Typography className='max-w-[364px] text-center text-textSecondary'>
                  {t('features.update.description')}
                </Typography>
              </div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className='flex flex-col gap-4 justify-center items-center p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1'>
                <div className={classnames('relative group', styles.featureIcon)}>
                  <div className='absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300' />
                  <div className='relative flex items-center border-2 border-primary/20 rounded-full p-5 is-[82px] bs-[82px] bg-background group-hover:border-primary transition-colors duration-300'>
                    <TransitionUp className="text-primary" fontSize="large" />
                  </div>
                </div>
                <Typography variant='h5' className='font-semibold text-center'>
                  {t('features.compliance.title')}
                </Typography>
                <Typography className='max-w-[364px] text-center text-textSecondary'>
                  {t('features.compliance.description')}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className='flex flex-col gap-4 justify-center items-center p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1'>
                <div className={classnames('relative group', styles.featureIcon)}>
                  <div className='absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300' />
                  <div className='relative flex items-center border-2 border-primary/20 rounded-full p-5 is-[82px] bs-[82px] bg-background group-hover:border-primary transition-colors duration-300'>
                    <Cube className="text-primary" fontSize="large" />
                  </div>
                </div>
                <Typography variant='h5' className='font-semibold text-center'>
                  {t('features.notification.title')}
                </Typography>
                <Typography className='max-w-[364px] text-center text-textSecondary'>
                  {t('features.notification.description')}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className='flex flex-col gap-4 justify-center items-center p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1'>
                <div className={classnames('relative group', styles.featureIcon)}>
                  <div className='absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300' />
                  <div className='relative flex items-center border-2 border-primary/20 rounded-full p-5 is-[82px] bs-[82px] bg-background group-hover:border-primary transition-colors duration-300'>
                    <LifeBuoy className="text-primary" fontSize="large" />
                  </div>
                </div>
                <Typography variant='h5' className='font-semibold text-center'>
                  {t('features.bookmark.title')}
                </Typography>
                <Typography className='max-w-[364px] text-center text-textSecondary'>
                  {t('features.bookmark.description')}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <div className='flex flex-col gap-4 justify-center items-center p-6 rounded-xl transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1'>
                <div className={classnames('relative group', styles.featureIcon)}>
                  <div className='absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300' />
                  <div className='relative flex items-center border-2 border-primary/20 rounded-full p-5 is-[82px] bs-[82px] bg-background group-hover:border-primary transition-colors duration-300'>
                    <Document className="text-primary" fontSize="large" />
                  </div>
                </div>
                <Typography variant='h5' className='font-semibold text-center'>
                  {t('features.integration.title')}
                </Typography>
                <Typography className='max-w-[364px] text-center text-textSecondary'>
                  {t('features.integration.description')}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default UsefulFeature
