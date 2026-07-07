'use client'
// React Imports
import { useRef, useState, useEffect } from 'react'
import type { FormEvent, KeyboardEvent, RefObject, MouseEvent } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import { ChatSessionType } from '@/entities/chat-session'
import { ChatHistoryType } from '@/entities/chat-history'
import { DataResponse, useAxios } from '@/hooks/useAxios'
import toast from 'react-hot-toast'
import authConfig from '@configs/auth'
import { Box, CircularProgress } from '@mui/material'
import { useTranslations } from 'next-intl'

type Props = {
	histories: ChatHistoryType[]
	setHistories: (histories: ChatHistoryType[]) => void
	session: ChatSessionType
	isBelowSmScreen: boolean
	isBelowLgScreen: boolean
	messageInputRef: RefObject<HTMLDivElement>
}

const EmojiPicker = ({
	onChange,
	isBelowSmScreen,
	openEmojiPicker,
	setOpenEmojiPicker,
	anchorRef
}: {
	onChange: (value: string) => void
	isBelowSmScreen: boolean
	openEmojiPicker: boolean
	setOpenEmojiPicker: (value: boolean | ((prevVar: boolean) => boolean)) => void
	anchorRef: RefObject<HTMLButtonElement>
}) => {
	return (
		<>
			<Popper
				open={openEmojiPicker}
				transition
				disablePortal
				placement='top-start'
				className='z-[12]'
				anchorEl={anchorRef.current}
			>
				{({ TransitionProps, placement }) => (
					<Fade {...TransitionProps} style={{ transformOrigin: placement === 'top-start' ? 'right top' : 'left top' }}>
						<Paper>
							<ClickAwayListener onClickAway={() => setOpenEmojiPicker(false)}>
								<span>
									<Picker
										emojiSize={18}
										theme='light'
										data={data}
										maxFrequentRows={1}
										onEmojiSelect={(emoji: any) => {
											onChange(emoji.native)
											setOpenEmojiPicker(false)
										}}
										{...(isBelowSmScreen && { perLine: 8 })}
									/>
								</span>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	)
}

const SendMsgForm = ({ session, histories, setHistories, isBelowSmScreen, isBelowLgScreen, messageInputRef }: Props) => {
	const t = useTranslations('chatbot.sendMessage');
	// States
	const [msg, setMsg] = useState('')
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
	const [isStreaming, setIsStreaming] = useState(false)

	// Refs
	const anchorRef = useRef<HTMLButtonElement>(null)
	const chatContainerRef = useRef<HTMLDivElement>(null)

	const open = Boolean(anchorEl)

	const handleToggle = () => {
		setOpenEmojiPicker(prevOpen => !prevOpen)
	}

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(prev => (prev ? null : event.currentTarget))
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleSendMsg = (event: FormEvent | KeyboardEvent, msg: string) => {
		event.preventDefault()

		if (msg.trim() !== '') {
			streamSubmit()
			setMsg('')
		}
	}

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
		}
	}

	const streamSubmit = async () => {
		setIsStreaming(true);
		let localstreamingAnswer = '';
		let chatHistory: {}
		const authToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

		const params = new URLSearchParams({
			chat_session_id: `${session.id}`,
			query: msg,
			token: authToken
		});

		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/chat-completion?${params.toString()}`
		);

		eventSource.onmessage = (event) => {
			if (event.data.startsWith('[CHAT_HISTORY]')) {
				chatHistory = JSON.parse(event.data.replace('[CHAT_HISTORY]', '')) as ChatHistoryType;
				setHistories([...histories, { ...chatHistory, is_streaming: true }]);
				setTimeout(scrollToBottom, 100)
				return
			}
			if (event.data === '[DONE]') {
				eventSource.close();
				setHistories([...histories, { ...chatHistory, answer: localstreamingAnswer, is_streaming: false }]);
				setIsStreaming(false);
				setTimeout(scrollToBottom, 100)
				return;
			}
			localstreamingAnswer += event.data.replaceAll('<br>', '  \n');
			setHistories([...histories, { ...chatHistory, answer: localstreamingAnswer, is_streaming: true }]);
			setTimeout(scrollToBottom, 100)
		};

		eventSource.onerror = function (error) {
			console.log('Stream error:', error);
			eventSource.close();
			setIsStreaming(false);
		};
	};

	const handleInputEndAdornment = () => {
		return (
			<div className='flex items-center gap-1'>
				{isBelowSmScreen ? (
					<>
						<IconButton
							id='option-menu'
							aria-haspopup='true'
							{...(open && { 'aria-expanded': true, 'aria-controls': 'share-menu' })}
							onClick={handleClick}
							ref={anchorRef}
						>
							<i className='ri-more-2-line text-textPrimary' />
						</IconButton>
						<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
							<MenuItem
								onClick={() => {
									handleToggle()
									handleClose()
								}}
							>
								<i className='ri-emotion-happy-line text-textPrimary' />
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<i className='ri-mic-line text-textPrimary' />
							</MenuItem>
							<MenuItem onClick={handleClose} className='p-0'>
								<label htmlFor='upload-img' className='plb-2 pli-5'>
									<i className='ri-attachment-2 text-textPrimary' />
									<input hidden type='file' id='upload-img' />
								</label>
							</MenuItem>
						</Menu>
						<EmojiPicker
							anchorRef={anchorRef}
							openEmojiPicker={openEmojiPicker}
							setOpenEmojiPicker={setOpenEmojiPicker}
							isBelowSmScreen={isBelowSmScreen}
							onChange={value => {
								setMsg(msg + value)

								if (messageInputRef.current) {
									messageInputRef.current.focus()
								}
							}}
						/>
					</>
				) : (
					<>
						<IconButton ref={anchorRef} size='small' onClick={handleToggle}>
							<i className='ri-emotion-happy-line text-textPrimary' />
						</IconButton>
						<EmojiPicker
							anchorRef={anchorRef}
							openEmojiPicker={openEmojiPicker}
							setOpenEmojiPicker={setOpenEmojiPicker}
							isBelowSmScreen={isBelowSmScreen}
							onChange={value => {
								setMsg(msg + value)

								if (messageInputRef.current) {
									messageInputRef.current.focus()
								}
							}}
						/>
					</>
				)}
				{isBelowSmScreen ? (
					<CustomIconButton variant='contained' color='primary' type='submit'>
						<i className='ri-send-plane-line' />
					</CustomIconButton>
				) : (
					<Button loading={isStreaming} variant='contained' color='primary' type='submit' endIcon={<i className='ri-send-plane-line' />}>
						Send
					</Button>
				)}
			</div>
		)
	}

	useEffect(() => {
		setMsg('')
	}, [session.id])

	return (
		<>
			<div ref={chatContainerRef} />
			<Box
				// sx={{ position: 'fixed', bottom: 0, left: '25%', right: 0 }}
				// sx={{ padding: 4, borderTop: '1px solid var(--mui-palette-divider)', backgroundColor: 'var(--mui-palette-customColors-chatBg)' }}
				sx={{
                    mx: 'auto', 
                    mb: 4, 
                    maxWidth: '48rem', // 768px, sesuaikan jika perlu
                    width: '100%',
                }}
			>
				<form
					autoComplete='off'
					onSubmit={event => handleSendMsg(event, msg)}
					// className='bg-[var(--mui-palette-customColors-chatBg)]'
				>
					<Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: '999px', // Membuat bentuk pil
                            backgroundColor: 'var(--mui-palette-background-paper)',
                            transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
							border: '1px solid',
							// borderColor: 'transparent', 
							borderColor: 'var(--mui-palette-divider)',
							// boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
							'&:focus-within, &:hover': {
								borderColor: 'var(--mui-palette-primary-main)',
								boxShadow:
									'0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 8px 0px rgba(0, 0, 0, 0.12)'
							}
                        }}
                    >
						<TextField
							fullWidth
							multiline
							maxRows={5}
							placeholder={t('placeholder')}
							value={msg}
							onChange={e => setMsg(e.target.value)}
							sx={{
								flex: 1, 
								'& .MuiOutlinedInput-root': {
									'& fieldset': { border: 'none' },
									'&.Mui-focused fieldset': {
										border: 'none',
									},
								},
							}}
							onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									handleSendMsg(e, msg)
								}
							}}
							size='small'
							inputRef={messageInputRef}
						/>
						<IconButton
							type="submit"
							disabled={!msg.trim() || isStreaming}
							sx={{
								'&:not(:disabled)': {
									backgroundColor: 'primary.main',
									color: 'primary.contrastText',
									'&:hover': {
										backgroundColor: 'primary.dark'
									}
								},
								transition: 'background-color 0.3s ease-in-out'
							}}
						>
							{isStreaming ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								<i className='ri-send-plane-2-fill' />
							)}
						</IconButton>
					</Box>
				</form>
			</Box>
		</>
	)
}

export default SendMsgForm
