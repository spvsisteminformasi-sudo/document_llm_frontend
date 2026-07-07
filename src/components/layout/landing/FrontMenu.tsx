'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider' 

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Component Imports
import DropdownMenu from './DropdownMenu'
import LanguageSwitcher from '@/components/LanguageSwitcher' // Pastikan path ini benar
import ModeDropdown from '@components/layout/shared/ModeDropdown' // Pastikan path ini benar

type Props = {
	mode: Mode
	isDrawerOpen: boolean
	setIsDrawerOpen: (open: boolean) => void
}

type WrapperProps = {
	children: React.ReactNode
	isBelowLgScreen: boolean
	className?: string
	isDrawerOpen: boolean
	setIsDrawerOpen: (open: boolean) => void
}

const Wrapper = (props: WrapperProps) => {
	// Props
	const { children, isBelowLgScreen, className, isDrawerOpen, setIsDrawerOpen } = props

	if (isBelowLgScreen) {
		return (
			<Drawer
				variant='temporary'
				anchor='left'
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				ModalProps={{
					keepMounted: true
				}}
				sx={{ '& .MuiDrawer-paper': { width: ['100%', 300] } }}
				className={classnames('p-5', className)}
			>
				<div className='p-4 flex flex-col gap-x-3'>
					<IconButton onClick={() => setIsDrawerOpen(false)} className='absolute inline-end-4 block-start-2'>
						<i className='ri-close-line' />
					</IconButton>
					<div className='flex flex-col gap-x-3'>
						{children}
					</div>
					<div className='flex-grow' />
					<Divider className='mbs-4' />
					<div className='flex items-center justify-between p-2'>
						<Typography color='text.primary'>Language</Typography>
						<LanguageSwitcher />
					</div>
					<div className='flex items-center justify-between p-2'>
						<Typography color='text.primary'>Theme Mode</Typography>
						<ModeDropdown />
					</div>
				</div>
			</Drawer>
		)
	}

	return <div className={classnames('flex items-center flex-wrap gap-x-4 gap-y-3', className)}>{children}</div>
}

const FrontMenu = (props: Props) => {
	// Props
	const { isDrawerOpen, setIsDrawerOpen, mode } = props

	// Hooks
	const pathname = usePathname()
	const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
	const { intersections } = useIntersection()

	useEffect(() => {
		if (!isBelowLgScreen && isDrawerOpen) {
			setIsDrawerOpen(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBelowLgScreen])

	const handleLinkClick = () => {
		if (isBelowLgScreen) {
			setIsDrawerOpen(false)
		}
	}
	return (
		<Wrapper isBelowLgScreen={isBelowLgScreen} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
			<Typography
				component={Link}
				href='/'
				className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
					'text-primary':
						!intersections.features &&
						!intersections.team &&
						!intersections.faq &&
						!intersections['contact-us'] &&
						pathname === '/'
				})}
				color='text.primary'
        		onClick={handleLinkClick}
			>
				Home
			</Typography>
			<Typography
				component={Link}
				href='/pedoman'
				className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
					'text-primary': pathname.startsWith('/pedoman')
				})}
				color='text.primary'
        		onClick={handleLinkClick}
			>
				Rules
			</Typography>
			<Typography
				component={Link}
				href='/qa-document'
				className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
					'text-primary': pathname === '/qa-document'
				})}
				color='text.primary'
        		onClick={handleLinkClick}
			>
				Question & Answer
			</Typography>
			<Typography
				component={Link}
				href='/chatbot'
				className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
					'text-primary': pathname === '/chatbot'
				})}
				color='text.primary'
        		onClick={handleLinkClick}
			>
				Chatbot
			</Typography>
			{/* <Typography
        component={Link}
        href='/#features'
        className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
          'text-primary': intersections.features
        })}
        color='text.primary'
      >
        Features
      </Typography> */}
			<Typography
				component={Link}
				href='/#faq'
				className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
					'text-primary': intersections.faq
				})}
				color='text.primary'
        		onClick={handleLinkClick}
			>
				FAQ
			</Typography>
			{/* <Typography
        component={Link}
        href='/#contact-us'
        className={classnames('font-medium plb-3 pli-1.5 hover:text-primary', {
          'text-primary': intersections['contact-us']
        })}
        color='text.primary'
      >
        Contact us
      </Typography> */}
			{/* <DropdownMenu
        mode={mode}
        isBelowLgScreen={isBelowLgScreen}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      /> */}
			{/* <Typography
        component={Link}
        href='/'
        target='_blank'
        className='font-medium plb-3 pli-1.5 hover:text-primary'
        color='text.primary'
      >
        Admin
      </Typography> */}
		</Wrapper>
	)
}

export default FrontMenu
