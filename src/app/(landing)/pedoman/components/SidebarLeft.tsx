// React Imports
import { useState } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import type { ThemeColor } from '@core/types'

// Tree Imports
import TreeviewDocument from './TreeviewDocument'

// Styles Imports
import styles from './styles.module.css'
import { TagType } from '@/entities/tag'

type Props = {
	treeData: TagType[] | null;
	isLoading: boolean;
	isBelowLgScreen: boolean;
	isBelowMdScreen: boolean;
	isBelowSmScreen: boolean;
	sidebarOpen: boolean;
	setSidebarOpen: (value: boolean) => void
	onTagSelected: (tag: TagType) => void
}

type LabelColor = {
	color: ThemeColor
	colorClass: string
}

// Constants
const icons = {
	inbox: 'ri-mail-line',
	sent: 'ri-send-plane-line',
	draft: 'ri-edit-box-line',
	starred: 'ri-star-line',
	spam: 'ri-spam-2-line',
	trash: 'ri-delete-bin-7-line'
}

export const labelColors: { [key: string]: LabelColor } = {
	personal: { color: 'success', colorClass: 'text-success' },
	company: { color: 'primary', colorClass: 'text-primary' },
	important: { color: 'warning', colorClass: 'text-warning' },
	private: { color: 'error', colorClass: 'text-error' }
}

const ScrollWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className='bs-full overflow-y-auto overflow-x-hidden'>
			{children}
		</div>
	)
}

const SidebarLeft = (props: Props) => {
	const {
		treeData,
		isLoading,
		isBelowLgScreen,
		isBelowMdScreen,
		isBelowSmScreen,
		sidebarOpen,
		setSidebarOpen,
		onTagSelected
	} = props

	return (
		<>
			<Drawer
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				className='bs-full'
				variant={!isBelowMdScreen ? 'permanent' : 'persistent'}
				ModalProps={{ disablePortal: true, keepMounted: true }}
				sx={{
					zIndex: isBelowMdScreen && sidebarOpen ? 11 : 10,
					position: !isBelowMdScreen ? 'static' : 'absolute',
					'& .MuiDrawer-paper': {
						boxShadow: 'none',
						overflow: 'hidden',
						width: isBelowMdScreen ? '280px' : '100%',
						position: !isBelowMdScreen ? 'static' : 'absolute'
					}
				}}
			>
				<CardContent
					className='flex items-center gap-1 is-full max-sm:pli-4 pli-6 border-be'
					sx={{
						padding: '14px 0 14px 0!important'
					}}
				>
					<Typography variant='h5' className='uppercase pli-5'>Peraturan</Typography>
				</CardContent>
				<ScrollWrapper>
					<div className='flex flex-col gap-1 plb-4'>
						<TreeviewDocument
							treeData={treeData}
							isLoading={isLoading}
							onItemSelected={onTagSelected}
						/>
					</div>
				</ScrollWrapper>
			</Drawer>
		</>
	)
}

export default SidebarLeft
