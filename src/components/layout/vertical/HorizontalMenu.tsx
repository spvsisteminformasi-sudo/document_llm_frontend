// React Imports
import { useState } from 'react';
import type { MouseEvent } from 'react';

// Next Imports
import Link from 'next/link';

// MUI Imports
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material'; // Aliased imports

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import HorizontalNav, { Menu, MenuItem } from '@menu/horizontal-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'

const menuData = [
	{
		href: '/admin',
		icon: <i className='ri-home-smile-line' />,
		label: 'Home'
	},
	{
		href: '/admin/documents',
		icon: <i className='ri-file-text-line' />,
		label: 'Document'
	},
	{
		href: '/admin/tags',
		icon: <i className='ri-price-tag-3-line' />,
		label: 'Tags'
	},
	{
		href: '/admin/users',
		icon: <i className='ri-user-line' />,
		label: 'User'
	}
];

type RenderExpandIconProps = {
	level?: number
}

type RenderVerticalExpandIconProps = {
	open?: boolean
	transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
	<StyledHorizontalNavExpandIcon level={level}>
		<i className='ri-arrow-right-s-line' />
	</StyledHorizontalNavExpandIcon>
)


const HorizontalMenu = () => {
	// Hooks
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	// Handler untuk membuka menu mobile
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	// Handler untuk menutup menu mobile
	const handleClose = () => {
		setAnchorEl(null);
	};

	// Tampilan untuk mobile (Dropdown Menu)
	if (isMobile) {
		return (
			<Box>
				<IconButton
					aria-label='more'
					aria-controls='long-menu'
					aria-haspopup='true'
					onClick={handleClick}
				>
					<i className='ri-apps-2-fill' />
				</IconButton>
				<MuiMenu
					id='long-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
				>
					{menuData.map((item, index) => (
						<Link href={item.href} passHref key={index}>
							<MuiMenuItem onClick={handleClose}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									{item.icon}
									{item.label}
								</Box>
							</MuiMenuItem>
						</Link>
					))}
				</MuiMenu>
			</Box>
		);
	}

	return (
		<Menu
			renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
			renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
			menuItemStyles={menuItemStyles(theme, 'ri-circle-fill')}
		>
			{menuData.map((item, index) => (
				<MenuItem key={index} href={item.href} icon={item.icon}>
					{item.label}
				</MenuItem>
			))}
		</Menu>
	)
}

export default HorizontalMenu
