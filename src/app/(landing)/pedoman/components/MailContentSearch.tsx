// MUI Imports
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Tooltip from '@mui/material/Tooltip'

type Props = {
	isBelowScreen: boolean
	searchTerm: string
	setSidebarOpen: (value: boolean) => void
	setBackdropOpen: (value: boolean) => void
	setSearchTerm: (value: string) => void
	onRefresh: () => void
}

const MailContentSearch = (props: Props) => {
	// Props
	const { isBelowScreen, searchTerm, setSidebarOpen, setBackdropOpen, setSearchTerm, onRefresh } = props

	// Open sidebar on below md screen
	const handleToggleSidebar = () => {
		setSidebarOpen(true)
		setBackdropOpen(true)
	}

	return (
		<div className='flex items-center gap-1 is-full max-sm:pli-4 pli-6 border-be'>
			{isBelowScreen && (
				<IconButton onClick={handleToggleSidebar}>
					<i className='ri-side-bar-line' />
				</IconButton>
			)}
			<InputBase
				fullWidth
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				startAdornment={<i className='ri-search-line text-textDisabled text-[22px] mie-4' />}
				placeholder='Search Peraturan'
				className='bs-[56px]'
			/>
			<Tooltip title="Tampilkan Semua Dokumen">
				<IconButton onClick={onRefresh}>
					<i className='ri-refresh-line' />
				</IconButton>
			</Tooltip>
		</div>
	)
}

export default MailContentSearch
