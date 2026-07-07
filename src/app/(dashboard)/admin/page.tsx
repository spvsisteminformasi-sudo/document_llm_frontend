// frontend\src\app\(dashboard)\admin\page.tsx

'use client'

import { useEffect, useState } from 'react'
import {
	Button,
	TextField,
	Card,
	CardContent,
	Typography,
	Container,
	Box,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	ListItemButton,
	DialogContent,
	Dialog,
	IconButton,
	DialogTitle,
} from '@mui/material'
import { DataResponse, ListRequest, useAxios } from '@/hooks/useAxios'
import CloseIcon from '@mui/icons-material/Close'
import { DocumentQaType, SourceType } from '@/entities/document-qa'
import FolderIcon from '@mui/icons-material/Folder'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import type { DocumentType } from '@/entities/document'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import toast from 'react-hot-toast'
import { useTitle } from '@/hooks/useTitle'

import Link from 'next/link'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import type { ThemeColor } from '@core/types'

type DataType = {
  title: string
  description: string
  type: string
  image: string
  color: ThemeColor
  imageColorClass?: string
  bgColorClass?: string
  url?: string
}

// Vars
const data: DataType[] = [
  {
    title: 'Question Answer',
    description: 'Dapatkan solusi secara cepat dan akurat dari pertanyaan Anda langsung dari sumber terpercaya',
    type: 'Q&A',
    image: '/images/icons/hand-with-bulb-dark.png',
    color: 'primary',
    imageColorClass: 'bg-primaryLight',
    bgColorClass: 'bg-primaryLighter',
    url: '/qa-document'
  },
  {
    title: 'Chatbot',
    description: 'Dapatkan bantuan langsung melalui chatbot dan berinteraksi secara instan dengan kami kapan saja',
    type: 'Chat',
    image: '/images/icons/hand-with-bulb-light.png',
    color: 'success',
    imageColorClass: 'bg-primaryLight',
    bgColorClass: 'bg-primaryLighter',
    url: '/chatbot'
  },
  {
    title: 'My Profile',
    description: 'Kelola data akun dan pengaturan profil Anda di sini.',
    type: 'Profile',
    image: '/images/icons/profile.png',
    color: 'error',
    imageColorClass: 'bg-errorLight',
    bgColorClass: 'bg-errorLighter',
    url: '/admin/profile'
  }
]

const ColoredCards = () => {
  return (
    <Grid container spacing={6}>
      {data.map((item, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={index}>
          <div
            className={classnames(
              'flex max-sm:flex-col items-center sm:items-start justify-between gap-6 rounded p-5',
              item.bgColorClass
            )}
          >
            <div className='flex flex-col items-center sm:items-start max-sm:text-center'>
				<Typography variant='h5' color={`${item.color}.main`} className='mbe-2'>
					{item.title}
				</Typography>
				<Typography className='mbe-4' color='text.primary'>
					{item.description}
				</Typography>
				<Link 
					href={`${item.url}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant='contained' size='small' color={item.color}>{`View ${item.type}`}</Button>
				</Link>
            </div>
            <div
              className={classnames(
                'flex justify-center rounded min-is-[180px] max-sm:-order-1 pbs-[7px]',
                item.imageColorClass
              )}
            >
              <img src={item.image} alt={item.title} className='bs-[120px]' />
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  )
}

export default ColoredCards
