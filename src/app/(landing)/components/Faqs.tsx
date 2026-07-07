'use client'
// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import ElementOne from '@/assets/svg/front-pages/landing-page/ElementOne'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from './styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'Apa itu Aplikasi Airo Chat?',
    answer:
      'Airo Chat adalah platform chatbot AI yang dirancang khusus untuk karyawan Perumda Air Minum Surya Sembada. Aplikasi ini berfungsi sebagai asisten digital yang membantu Anda menemukan, memahami, dan mematuhi berbagai peraturan internal, SOP (Standard Operating Procedure), dan dokumen penting perusahaan secara cepat dan akurat.'
  },
  {
    id: 'panel2',
    question: 'Bagaimana fungsi utama Airo Chat?',
    active: true,
    answer:
      'Airo Chat memiliki fungsi utama sebagai pencarian cerdas dan chatbot interaktif. Anda dapat bertanya langsung tentang isi dokumen, meminta ringkasan peraturan, atau mencari informasi spesifik tanpa perlu membaca seluruh dokumen secara manual. Contohnya, "Apa saja prosedur pengajuan cuti?" atau "Ringkas isi Peraturan Direksi No. 123 tentang Pengadaan Barang".'
  },
  {
    id: 'panel3',
    question: 'Siapa yang dapat menggunakan aplikasi ini?',
    answer:
      'Aplikasi ini ditujukan untuk seluruh karyawan Perumda Air Minum Surya Sembada Kota Surabaya. Dari staf operasional hingga jajaran manajemen, semua dapat menggunakan Airo Chat untuk mengakses informasi yang relevan dengan pekerjaan mereka, memastikan kepatuhan, dan meningkatkan efisiensi kerja.'
  },
  {
    id: 'panel4',
    question: 'Bagaimana cara Airo Chat menemukan jawaban?',
    answer:
      'Airo Chat menggunakan teknologi RAG (Retrieval-Augmented Generation) AI. Ini berarti chatbot mengambil informasi dari basis data dokumen internal Perumda yang sudah diunggah, lalu merangkum dan menyajikannya dalam bentuk jawaban yang mudah dipahami. Setiap jawaban juga dilengkapi dengan referensi sumber dokumen aslinya.'
  }
]

const Faqs = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

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
    <section
      id='faq'
      ref={ref}
      className={classnames('flex flex-col gap-16 plb-[100px] bg-gradient-to-b from-background to-background/50',
        frontCommonStyles.layoutSpacing)}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center items-center relative'>
          <ElementOne className='absolute inline-end-0 animate-pulse' />
          <div className='flex items-center justify-center mbe-6 gap-3 hover:transform hover:scale-105 transition-transform'>
            <Lines className="text-primary" />
            <Typography variant='h6' className='uppercase text-primary font-medium tracking-wider'>
              FAQ
            </Typography>
          </div>
        </div>
        <div className='flex items-baseline flex-wrap gap-2 mbe-6 text-center'>
          <Typography variant='h3' className='bg-gradient-to-r from-primary to-info bg-clip-text text-transparent font-bold'>
            Frequently Asked
          </Typography>
          <Typography variant='h3' className='font-bold'>
            Questions
          </Typography>
        </div>
        <Typography className='font-medium text-center text-textSecondary max-w-2xl mx-auto'>
          Browse through these FAQs to find answers to commonly asked questions.
        </Typography>
      </div>
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, lg: 5 }} className='text-center'>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
            <img
              src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
              alt='girl with laptop'
              className='is-[80%] max-is-[320px] relative hover:transform hover:scale-105 transition-transform duration-300'
            />
          </div>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <div className="space-y-4">
            {FaqsData.map((data, index) => (
              <Accordion
                key={index}
                defaultExpanded={data.active}
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'background.paper'
                  }
                }}
              >
                <AccordionSummary
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  aria-controls={data.id + '-content'}
                  id={data.id + '-header'}
                >
                  {data.question}
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    fontSize: 14,
                    color: 'text.secondary',
                    lineHeight: 1.7
                  }}
                >
                  {data.answer}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Grid>
      </Grid>
    </section>
  )
}

export default Faqs
