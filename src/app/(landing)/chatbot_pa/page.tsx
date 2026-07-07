'use client'
// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Backdrop from '@mui/material/Backdrop'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

// Component Imports
import SidebarLeft from './components/SidebarLeft'
import ChatContent from './components/ChatContent'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useConfig } from '@/context/configContext'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import { Box } from '@mui/material'
import { ChatSessionType } from '@/entities/chat-session'
import { ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import References from './components/References'
import { ChatHistoryType } from '@/entities/chat-history'
import { useAbility } from '@/hooks/useAbility'
import { useTitle } from '@/hooks/useTitle'

const ChatbotPage = () => {
    const t = useTranslations('chatbot')
    // States
    useTitle(t('title'))
    const ability = useAbility()
    const [backdropOpen, setBackdropOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [referenceOpen, setReferenceOpen] = useState(false)

    // Refs
    const messageInputRef = useRef<HTMLDivElement>(null)

    // Hooks
    const { settings } = useSettings()
    const { setConfig } = useConfig()
    const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
    const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
    const [selectedSession, setSelectedSession] = useState<ChatSessionType | null>(null)
    const [chatSessions, setChatSessions] = useState<ChatSessionType[]>([])
    const [selectedHistory, setSelectedHistory] = useState<ChatHistoryType>(null)

    // Focus on message input when active user changes
    useEffect(() => {
        if (messageInputRef.current) {
            messageInputRef.current.focus()
        }
    }, [selectedSession])

    // Close backdrop when sidebar is open on below md screen
    useEffect(() => {
        if (!isBelowMdScreen && backdropOpen && sidebarOpen) {
            setBackdropOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBelowMdScreen])

    // Open backdrop when sidebar is open on below sm screen
    useEffect(() => {
        if (!isBelowSmScreen && sidebarOpen) {
            setBackdropOpen(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBelowSmScreen])

    // Close sidebar when backdrop is closed on below md screen
    useEffect(() => {
        if (!backdropOpen && sidebarOpen) {
            setSidebarOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backdropOpen])

    useEffect(() => {
        setConfig({
            hideFooter: true
        })
        return () => setConfig({})
    }, [setConfig])

    const {
        isLoading: isLoadingChatSession,
        statusCode: statusCodeChatSession,
        data: dataChatSession,
        fetch: fetchChatSession,
    } = useAxios<ListResponse<ChatSessionType>, ListRequest>({
        url: '/api/chat-sessions',
        method: 'get',
    })

    useEffect(() => {
        if (isLoadingChatSession && statusCodeChatSession === null) {
            return
        }

        if (statusCodeChatSession === 200 && dataChatSession?.data) {
            setChatSessions(dataChatSession.data)
        }
    }, [isLoadingChatSession, statusCodeChatSession, dataChatSession])

    useEffect(() => {
        ability.checkPermission('read', 'ChatSession')
        fetchChatSession()
    }, [])

    return (
        <Box className='h-screen relative overflow-hidden pbs-[100px] pbe-8 -mbs-[70px] bg-backgroundPaper z-[1]'>
            <Box
                className={ classNames(
                    commonLayoutClasses.contentHeightFixed, 
                    // 'flex is-full container mx-auto overflow-hidden rounded-lg relative', 
                    'container mx-auto flex h-full max-h-[90vh] overflow-hidden rounded-lg relative', 
                    {
                        border: settings.skin === 'bordered',
                        'shadow-md': settings.skin !== 'bordered'
                    }
                )}
            >
                <SidebarLeft
                    chatSessions={chatSessions}
                    setActiveSession={setSelectedSession}
                    selectedSession={selectedSession} 
                    backdropOpen={backdropOpen}
                    setBackdropOpen={setBackdropOpen}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    refreshSession={() => fetchChatSession()}
                    isBelowLgScreen={isBelowLgScreen}
                    isBelowMdScreen={isBelowMdScreen}
                    isBelowSmScreen={isBelowSmScreen}
                    messageInputRef={messageInputRef}
                />

                <ChatContent
                    session={selectedSession}
                    backdropOpen={backdropOpen}
                    setBackdropOpen={setBackdropOpen}
                    setSidebarOpen={setSidebarOpen}
                    refreshSession={() => fetchChatSession()}
                    isBelowMdScreen={isBelowMdScreen}
                    isBelowLgScreen={isBelowLgScreen}
                    isBelowSmScreen={isBelowSmScreen}
                    messageInputRef={messageInputRef}
                    setSelectedHistory={(history: ChatHistoryType) => {
                        setSelectedHistory(history)
                        setReferenceOpen(true)
                    }}
                />

                <Backdrop open={backdropOpen} onClick={() => setBackdropOpen(false)} className='absolute z-10' />
                <References
                    open={referenceOpen}
                    historyId={selectedHistory?.id}
                    onClose={function (): void {
                        setReferenceOpen(false)
                    }}
                />
            </Box>
        </Box>
    )
}

export default ChatbotPage
