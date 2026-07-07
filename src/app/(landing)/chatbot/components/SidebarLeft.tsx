'use client'
// React Imports
import { useState, useEffect } from 'react'
import type { ReactNode, RefObject } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import DeleteIcon from '@mui/icons-material/Delete'

// Util Imports
import { formatDateToMonthShort } from './utils'
import { ChatSessionType } from '@/entities/chat-session'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Box } from '@mui/material'
import OptionMenu from '@/@core/components/option-menu'
import { useTranslations } from 'next-intl'

type Props = {
	chatSessions: ChatSessionType[]
	refreshSession: () => void
	setActiveSession: (session: ChatSessionType | null) => void
	selectedSession: ChatSessionType | null
	backdropOpen: boolean
	setBackdropOpen: (value: boolean) => void
	sidebarOpen: boolean
	setSidebarOpen: (value: boolean) => void
	isBelowLgScreen: boolean
	isBelowMdScreen: boolean
	isBelowSmScreen: boolean
	messageInputRef: RefObject<HTMLDivElement>
}

// Scroll wrapper for chat list
const ScrollWrapper = ({ children, isBelowLgScreen }: { children: ReactNode; isBelowLgScreen: boolean }) => {
	if (isBelowLgScreen) {
		return <div className='bs-full overflow-y-auto overflow-x-hidden'>{children}</div>
	} else {
		return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
	}
}

const SidebarLeft = (props: Props) => {
	const t = useTranslations('chatbot.sidebar');
	// Props
	const {
		backdropOpen,
		chatSessions,
		refreshSession,
		setActiveSession,
		selectedSession,
		setBackdropOpen,
		sidebarOpen,
		setSidebarOpen,
		isBelowLgScreen,
		isBelowMdScreen,
		isBelowSmScreen,
		messageInputRef
	} = props

	// States
	const [searchValue, setSearchValue] = useState<string | null>()
	// const [selectedSession, setSelectedSession] = useState<ChatSessionType | null>(null)
	const [deleteSession, setDeleteSessions] = useState<ChatSessionType | null>(null)
	const auth = useAuth()
	// Add useEffect to fetch chat sessions

	const sortedSessions = [...chatSessions].sort((a, b) => 
		new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	const handleChange = (event: any, newValue: ChatSessionType | null) => {
		if (newValue) {
            // Langsung panggil fungsi dari parent untuk set sesi aktif
            setActiveSession(newValue);

            if (isBelowMdScreen) {
                setSidebarOpen(false);
                setBackdropOpen(false);
            }
            messageInputRef.current?.focus();
        }
		// console.log(newValue)
		// setSearchValue(newValue)
		// isBelowMdScreen && setSidebarOpen(false)
		// setBackdropOpen(false)
		// setSearchValue(null)
		// messageInputRef.current?.focus()
	}

	const {
		isLoading: isLoadingChatSessionCreate,
		statusCode: statusCodeChatSessionCreate,
		data: dataChatSessionCreate,
		fetch: fetchChatSessionCreate,
	} = useAxios<DataResponse<ChatSessionType>, ChatSessionType>({
		url: '/api/chat-sessions',
		method: 'post',
	})

	const {
		isLoading: isLoadingChatSessionDelete,
		statusCode: statusCodeChatSessionDelete,
		data: dataChatSessionDelete,
		fetch: fetchChatSessionDelete,
	} = useAxios<DataResponse<ChatSessionType>, ChatSessionType>({
		url: `/api/chat-sessions`,
		method: 'delete',
	})

	useEffect(() => {
		if (isLoadingChatSessionCreate && statusCodeChatSessionCreate === null) {
			return
		}

		if (dataChatSessionCreate?.success) {
			toast.success(dataChatSessionCreate?.message!)
			const newChatSession = dataChatSessionCreate.data;
			setActiveSession(newChatSession);
			// setSelectedSession(newChatSession);
			refreshSession()
		} else if (!dataChatSessionCreate?.success && dataChatSessionCreate?.message) {
			toast.error(dataChatSessionCreate?.message)
		}
	}, [statusCodeChatSessionCreate, dataChatSessionCreate])


	useEffect(() => {
		if (isLoadingChatSessionDelete && statusCodeChatSessionDelete === null) {
			return
		}

		if (statusCodeChatSessionDelete === 200 && dataChatSessionDelete?.success) {
			refreshSession()
			setActiveSession(null)
			// setSelectedSession(null)
			toast.success(dataChatSessionDelete.message)
		}
	}, [isLoadingChatSessionDelete, statusCodeChatSessionDelete, dataChatSessionDelete])


	const handleNewChat = async () => {
		try {
			const timeStamp = new Date().toLocaleString('id-ID', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
			// Reset active chat and create new session
			fetchChatSessionCreate({
				data: {
					// name: t('newChatTitle'),
					name: `${t('newChatTitle')} (${timeStamp})`,
					user_id: auth.user.id,
				}
			})
			isBelowMdScreen && setSidebarOpen(false)
			setBackdropOpen(false)
			messageInputRef.current?.focus()
		} catch (error) {
			console.error('Failed to create new chat session:', error)
		}
	}

	useEffect(() => {
		if (deleteSession) {
			fetchChatSessionDelete({
				url: `/api/chat-sessions/${deleteSession.id}`,
			})
		}
	}, [deleteSession])

	const renderChatSessions = () => {
		return sortedSessions.map(session => (
			<Box key={session.id}>
				<li
					key={session.id}
					className={classnames('flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg mb-1 transition-transform duration-150', {
						'bg-primary shadow-xs text-[var(--mui-palette-primary-contrastText)]': selectedSession && selectedSession.id === session.id,
						'hover:bg-background hover:shadow-lg hover:-translate-y-1': !(selectedSession && selectedSession.id === session.id)
					})}
					onClick={() => {
						setActiveSession(session)
						// setSelectedSession(session)
						isBelowMdScreen && setSidebarOpen(false)
						isBelowMdScreen && backdropOpen && setBackdropOpen(false)
					}}
				>
					<div className='min-is-0 flex-auto'>
						<Typography variant='body2' color={selectedSession && selectedSession.id === session.id ? 'inherit' : 'text.secondary'} className='truncate'>
							{session.name}
						</Typography>
					</div>
					<div className='flex items-center'>
						<OptionMenu
							iconButtonProps={{ size: 'small' }}
              				iconClassName={selectedSession?.id === session.id ? 'text-primary-contrastText' : 'text-textSecondary'}              
							options={[
								{ text: t('delete'), icon: <DeleteIcon fontSize='small' />, menuItemProps: { onClick: () => { setDeleteSessions(session) } } },
							]}
						/>
					</div>
				</li>
			</Box>
		))
	}

	return (
		<Box>
			<Drawer
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				className='bs-full'
				variant={!isBelowMdScreen ? 'permanent' : 'persistent'}
				ModalProps={{
					disablePortal: true,
					keepMounted: true // Better open performance on mobile.
				}}
				sx={{
					zIndex: isBelowMdScreen && sidebarOpen ? 11 : 10,
					position: !isBelowMdScreen ? 'static' : 'absolute',
					...(isBelowSmScreen && sidebarOpen && { width: '100%' }),
					'& .MuiDrawer-paper': {
						overflow: 'hidden',
						boxShadow: 'none',
						height: '100%',
						width: isBelowSmScreen ? '100%' : '370px',
						position: !isBelowMdScreen ? 'static' : 'absolute'
					}
				}}
			>
				<div className='flex plb-[18px] pli-5 gap-4 border-be'>
					<div className='flex is-full items-center flex-auto sm:gap-x-3 gap-y-2'>
						<Autocomplete
							fullWidth
							size='small'
							id='select-contact'
							// options={sortedSessions.map((session, index) => `${index + 1}. ${session.name}`) || []}
							options={sortedSessions}
							getOptionLabel={(option) => option.name || ''}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							// value={searchValue || null}
							value={null}
							onChange={handleChange}
							renderInput={params => (
								<TextField
									{...params}
									variant='outlined'
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: '999px !important' } }}
									placeholder={t('search')}
									slotProps={{
										input: {
											...params.InputProps,
											startAdornment: (
												<InputAdornment position='start'>
													<i className='ri-search-line text-xl' />
												</InputAdornment>
											)
										}
									}}
								/>
							)}
						/>
						<IconButton
							className='p-2 mis-1'
							onClick={handleNewChat}
							title={t('newChatTitle')}
						>
							<i className='ri-add-line text-xl' />
						</IconButton>
						{isBelowMdScreen ? (
							<IconButton
								className='p-0 mis-1'
								onClick={() => {
									setSidebarOpen(false)
									setBackdropOpen(false)
								}}
							>
								<i className='ri-close-line' />
							</IconButton>
						) : null}
					</div>
				</div>
				<ScrollWrapper isBelowLgScreen={isBelowLgScreen}>
					<ul className='p-3 pbs-4'>
						{renderChatSessions()}
					</ul>
				</ScrollWrapper>
			</Drawer>

		</Box>
	)
}



export default SidebarLeft
