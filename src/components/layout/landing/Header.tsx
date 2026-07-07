'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
// import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import GuestDropdown from '@components/layout/shared/GuestDropdown'
import FrontMenu from './FrontMenu'
import CustomIconButton from '@core/components/mui/IconButton'
import { useRouter } from 'next/navigation'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import { useAuth } from '@/hooks/useAuth'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const Header = ({ mode }: { mode: Mode }) => {
	// States
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const auth = useAuth()
	const router = useRouter()

	// Hooks
	const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

	// Detect window scroll
	const trigger = useScrollTrigger({
		threshold: 0,
		disableHysteresis: true
	})

	const handleUserLogout = async () => {
		// Redirect to login page
		localStorage.removeItem('userData')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('accessToken')
		router.push('/login')
	}

	return (
		<header className={classnames(frontLayoutClasses.header, styles.header)}>
			<div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })}>
				<div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
					{isBelowLgScreen ? (
						<div className='flex items-center gap-2 sm:gap-4'>
							<IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
								<i className='ri-menu-line text-textPrimary' />
							</IconButton>
							<Link href='/'>
								<Logo />
							</Link>
							<FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
						</div>
					) : (
						<div className='flex items-center gap-10'>
							<Link href='/'>
								<Logo />
							</Link>
							<FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
						</div>
					)}
					<div className='flex items-center gap-2 sm:gap-4'>
						{!isBelowLgScreen && (
							<>
								<LanguageSwitcher />
								{/* <ModeDropdown /> */}
							</>
						)}
						{!auth.user ? (
							isBelowLgScreen ? (
								<CustomIconButton component={Link} href='/admin' target='_blank'>
									<i className='ri-user-fill text-xl' />
								</CustomIconButton>
							) : (
								<Button
									component={Link}
									variant='contained'
									href='/admin'
									startIcon={<i className='ri-user-fill text-xl' />}
									className='whitespace-nowrap'
									target='_blank'
								>
									<span>Login</span>
								</Button>
							)
						) : auth.user.role === 'Admin' ? (
							isBelowLgScreen ? (
								<>
								<UserDropdown />
								{/* <CustomIconButton onClick={() => router.push('/admin')}>
									<i className='ri-user-settings-line text-xl' />
								</CustomIconButton> */}
								</>
							) : (
								<>
								<UserDropdown />
								{/* <Button
									variant='contained'
									color='primary'
									onClick={() => router.push('/admin')}
									startIcon={<i className='ri-user-settings-line text-xl' />}
								>
									<span>Account</span>
								</Button> */}
								</>
							)
						) : (
							isBelowLgScreen ? (
								<>
								<GuestDropdown />
								{/* <CustomIconButton onClick={handleUserLogout}>
									<i className='ri-logout-box-r-line text-xl' />
								</CustomIconButton> */}
								</>
							) : (
								<>
								<GuestDropdown />
								{/* <Button
									variant='contained'
									color='primary'
									startIcon={<i className='ri-logout-box-r-line' />}
									onClick={handleUserLogout}
								>
									<span>Logout</span>
								</Button> */}
								</>
							)
						)}
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
