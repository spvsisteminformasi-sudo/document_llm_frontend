'use client'
// React Imports
import { useRef, useEffect } from 'react'
import type { MutableRefObject, ReactNode } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'

import { ChatHistoryType } from '@/entities/chat-history'
import { ChatSessionType } from '@/entities/chat-session'
import ReactMarkdown from 'react-markdown'
import { Box, Button, CircularProgress, Stack } from '@mui/material'

type ChatLogProps = {
  histories: ChatHistoryType[]
  session: ChatSessionType
  setSelectedHistory: (history: ChatHistoryType) => void
  isBelowLgScreen: boolean
  isBelowMdScreen: boolean
  isBelowSmScreen: boolean
}

const ChatLog = ({ histories, session, setSelectedHistory, isBelowLgScreen, isBelowMdScreen, isBelowSmScreen }: ChatLogProps) => {

  // Refs
  const scrollRef = useRef(null)

  // Function to scroll to bottom when new message is sent
  const scrollToBottom = () => {
    if (scrollRef.current) {
      if (isBelowLgScreen) {
        // @ts-ignore
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      } else {
        // @ts-ignore
        scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight
      }
    }
  }

  // Scroll to bottom on new message
  useEffect(() => {
    if (session && histories && histories.length) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [histories, session])

  const renderChatLog = (history: ChatHistoryType, index: string) => (
    <div key={index}>
      <div key={index} className={classnames('flex gap-4 p-5', { 'flex-row-reverse': true })}>
        <div
          className={classnames('flex flex-col gap-2', {
            'items-end': true,
            'max-is-[65%]': !isBelowMdScreen,
            'max-is-[75%]': isBelowMdScreen && !isBelowSmScreen,
            'max-is-[calc(100%-5.75rem)]': isBelowSmScreen
          })}
        >
          <Typography
            className={classnames('whitespace-pre-wrap pli-4 plb-2 shadow-xs', {
              'bg-backgroundPaper rounded-e-lg rounded-b-lg': !true,
              'bg-primary text-[var(--mui-palette-primary-contrastText)] rounded-s-lg rounded-b-lg': true
            })}
            style={{ wordBreak: 'break-word' }}
          >
            {history.query}
          </Typography>
          <div className='flex items-center gap-2'>
            <Typography variant='caption'>
              {new Date(history.created_at).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classnames('flex gap-4 p-5', { 'flex-row-reverse': false })}>
        <div
          className={classnames('flex flex-col gap-2', {
            'items-end': false,
          })}
        >
          {history.answer !== 'AI is typing...' ? (
            <Box
              className={classnames('pli-4 plb-2 shadow-xs', {
                'bg-backgroundPaper rounded-e-lg rounded-b-lg': !false,
                'bg-primary rounded-s-lg rounded-b-lg': false
              })}
            >
              <Box sx={{ ml: 4, mb: 2 }}>
                <ReactMarkdown>
                  {history.answer}
                </ReactMarkdown>
                {history.is_streaming === false ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      onClick={() => {
                        setSelectedHistory(history)
                        console.log('Show references for:', history.id)
                      }}
                      sx={{
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                      }}
                    >
                      <i className="ri-links-line" />
                      References
                    </Button>
                  </Box>
                ) : null}
              </Box>
            </Box>
          ) : (
            <>
              <Stack direction={'row'} gap={3}>
                <CircularProgress size={'20px'} />
                <Typography>Ai is thinking</Typography>
              </Stack>
            </>
          )}
          <div className='flex items-center gap-2'>
            <Typography variant='caption'>
              {new Date(history.created_at).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              })}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )

  return (

    <CardContent className='p-0'>
      {session && histories.map((history, index) => {
        return renderChatLog(history, `${index}-user`)
      })}
    </CardContent>
  )
}

export default ChatLog
