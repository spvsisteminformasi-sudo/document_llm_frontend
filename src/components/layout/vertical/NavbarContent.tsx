'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import HorizontalMenu from './HorizontalMenu'
import NavSearch from '../shared/search'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MobileActionMenu from './MobileActionMenu'

const NavbarContent = () => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))

	return (
		<div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
			<div className='flex items-center gap-4'>
				<NavToggle />
				{isMobile && (
					<Link href='/'>
						<Logo />
					</Link>
				)}
			</div>
			{!isMobile && (
				<div className='flex-grow'>
					<HorizontalMenu />
				</div>
			)}
			<div className='flex items-center'>
				{isMobile ? (
				<>
					<MobileActionMenu />
					<HorizontalMenu />
				</>
				) : (
				<>
					<LanguageSwitcher />
					<NavSearch />
					<ModeDropdown />
				</>
				)}
				<UserDropdown />
			</div>
		</div>
	)
}

export default NavbarContent
