// @/components/layout/vertical/MobileActionMenu.tsx

'use client'

// React Imports
import { useState } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material'

// Component Imports
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import NavSearch from '../shared/search'

const MobileActionMenu = () => {
	// State untuk mengontrol menu dropdown
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	// Handler untuk membuka menu
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	// Handler untuk menutup menu
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<IconButton
				aria-label='more'
				aria-controls='long-menu'
				aria-haspopup='true'
				onClick={handleClick}
			>
				<i className='ri-more-2-line' />
			</IconButton>
			<MuiMenu
				id='long-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				// Mencegah menu menutup ketika item di dalamnya diklik
				// Berguna untuk dropdown di dalam dropdown
				slotProps={{
					paper: {
						sx: {
							width: 200,
						},
					}
				}}
			>
				{/*
          Kita menempatkan setiap komponen di dalam MuiMenuItem.
          Box di dalamnya membantu mengatur layout dan padding.
        */}
				<MuiMenuItem sx={{ p: 0 }} onClick={(e) => e.stopPropagation()}>
					<Box className='flex items-center justify-between is-full plb-2 pli-4'>
						<span className='text-textPrimary'>Language</span>
						<LanguageSwitcher />
					</Box>
				</MuiMenuItem>
				<MuiMenuItem sx={{ p: 0 }} onClick={(e) => e.stopPropagation()}>
					<Box className='flex items-center justify-between is-full plb-2 pli-4'>
						<span className='text-textPrimary'>Mode</span>
						<ModeDropdown />
					</Box>
				</MuiMenuItem>
				<MuiMenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}>
					<Box className='is-full pli-1'>
						{/* NavSearch biasanya butuh lebih banyak ruang, jadi kita tampilkan sendiri */}
						<NavSearch />
					</Box>
				</MuiMenuItem>
			</MuiMenu>
		</>
	)
}

export default MobileActionMenu