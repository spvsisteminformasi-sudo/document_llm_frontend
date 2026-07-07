'use client'
// React Imports
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
// Component Imports
import OptionMenu from '@core/components/option-menu'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'
import UserProfileRight from './UserProfileRight'
import CustomAvatar from '@core/components/mui/Avatar'
import { ChatSessionType } from '@/entities/chat-session'
import { ChatHistoryType, ListChatHistoryRequest } from '@/entities/chat-history'
import { ListResponse, useAxios } from '@/hooks/useAxios'
import { Box } from '@mui/material'
import { useTranslations } from 'next-intl'

type Props = {
	session: ChatSessionType
	backdropOpen: boolean
	refreshSession: () => void
	setSelectedHistory: (history: ChatHistoryType) => void
	setBackdropOpen: (open: boolean) => void
	setSidebarOpen: (open: boolean) => void
	isBelowMdScreen: boolean
	isBelowLgScreen: boolean
	isBelowSmScreen: boolean
	messageInputRef: RefObject<HTMLDivElement>
}

// Renders the user avatar with badge and user information
const UserAvatar = ({
	session,
	setUserProfileLeftOpen,
	setBackdropOpen
}: {
	session: ChatSessionType
	setUserProfileLeftOpen: (open: boolean) => void
	setBackdropOpen: (open: boolean) => void
}) => (
	<div
		className='flex items-center gap-4 cursor-pointer'
		onClick={() => {
			setUserProfileLeftOpen(true)
			setBackdropOpen(true)
		}}
	>
		<div>
			<Typography color='text.primary'>{session?.user.name}</Typography>
			<Typography variant='body2'>{session?.user.email}</Typography>
		</div>
	</div>
)

const ChatContent = (props: Props) => {
	const t = useTranslations('chatbot.chatContent');
	// Props
	const {
		session,
		backdropOpen,
		refreshSession,
		setSelectedHistory,
		setBackdropOpen,
		setSidebarOpen,
		isBelowMdScreen,
		isBelowSmScreen,
		isBelowLgScreen,
		messageInputRef
	} = props

	// States
	const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)
	const [histories, setHistories] = useState<ChatHistoryType[]>([])

	// Close user profile right drawer if backdrop is closed and user profile right drawer is open
	useEffect(() => {
		if (!backdropOpen && userProfileRightOpen) {
			setUserProfileRightOpen(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [backdropOpen])

	useEffect(() => {
		if (session?.id) {
			fetchChatHistory({
				data: {
					chat_session_id: session?.id
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session])

	const {
		isLoading: isLoadingChatHistory,
		statusCode: statusCodeChatHistory,
		data: dataChatHistory,
		fetch: fetchChatHistory,
	} = useAxios<ListResponse<ChatSessionType>, ListChatHistoryRequest>({
		url: '/api/chat-histories',
		method: 'get',
	})

	useEffect(() => {
		if (isLoadingChatHistory && statusCodeChatHistory === null) {
			return
		}

		if (statusCodeChatHistory === 200 && dataChatHistory?.data) {
			setHistories(dataChatHistory.data)
		}
	}, [isLoadingChatHistory, statusCodeChatHistory, dataChatHistory])

	useEffect(() => {
		if (histories.length === 1) {
			refreshSession()
		}
	}, [histories])

	return !session ? (
		<CardContent sx={{ minHeight: '100vh' }} className='flex flex-col flex-auto items-center justify-center bs-full gap-[18px]'>
			<CustomAvatar variant='circular' size={98} color='primary' skin='light'>
				<i className='ri-wechat-line text-[50px]' />
			</CustomAvatar>
			<Typography className='text-center'>{t('startConversation')}</Typography>
			{isBelowMdScreen && (
				<Button
					variant='contained'
					className='rounded-full'
					onClick={() => {
						setSidebarOpen(true)
						isBelowSmScreen ? setBackdropOpen(false) : setBackdropOpen(true)
					}}
				>
					{t('selectSession')}
				</Button>
			)}
		</CardContent>
	) : (
		<>
			{session && (
				<Box 
					// sx={{ width: '100%' }}
					className="flex flex-col h-full w-full bg-backgroundPaper"
				>
					<div className='flex flex-col flex-grow bs-full'>
						<div className='flex items-center justify-between border-be plb-[17px] pli-5 bg-[var(--mui-palette-customColors-chatBg)]'>
							{isBelowMdScreen ? (
								<div className='flex items-center gap-4'>
									<IconButton
										onClick={() => {
											setSidebarOpen(true)
											setBackdropOpen(true)
										}}
									>
										<i className='ri-menu-line text-textSecondary text-xl' />
									</IconButton>
									<UserAvatar
										session={session}
										setBackdropOpen={setBackdropOpen}
										setUserProfileLeftOpen={setUserProfileRightOpen}
									/>
								</div>
							) : (
								<UserAvatar
									session={session}
									setBackdropOpen={setBackdropOpen}
									setUserProfileLeftOpen={setUserProfileRightOpen}
								/>
							)}
							{isBelowMdScreen ? (
								<OptionMenu
									iconClassName='text-textSecondary'
									options={[
										t('clearChat'),
									]}
								/>
							) : (
								<div className='flex items-center gap-1'>
									<OptionMenu
										iconClassName='text-textSecondary'
										options={[
											{
												text: t('viewContact'),
												menuItemProps: {
													onClick: () => {
														setUserProfileRightOpen(true)
														setBackdropOpen(true)
													}
												}
											},
											t('clearChat'),
										]}
									/>
								</div>
							)}
						</div>

						<Box className="flex-1 overflow-y-auto p-4">
						<ChatLog
							histories={histories}
							session={session}
							setSelectedHistory={setSelectedHistory}
							isBelowMdScreen={isBelowMdScreen}
							isBelowSmScreen={isBelowSmScreen}
							isBelowLgScreen={isBelowLgScreen}
						/>
						</Box>

						<SendMsgForm
							session={session}
							histories={histories}
							setHistories={setHistories}
							isBelowSmScreen={isBelowSmScreen}
							isBelowLgScreen={isBelowLgScreen}
							messageInputRef={messageInputRef}
						/>
					</div>
				</Box>
			)}

			{session && (
				<UserProfileRight
					open={userProfileRightOpen}
					handleClose={() => {
						setUserProfileRightOpen(false)
						setBackdropOpen(false)
					}}
					session={session}
					isBelowSmScreen={isBelowSmScreen}
					isBelowLgScreen={isBelowLgScreen}
				/>
			)}
		</>
	)
}

export default ChatContent
