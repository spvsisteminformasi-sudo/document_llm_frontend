// /home/usrepb/projects/labs/document_llm/frontend/src/app/(landing)/qa-document2/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  TextField,
  Typography,
  Box,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  IconButton,
  LinearProgress,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DocumentQaType } from '@/entities/document-qa'
import { DocumentType } from '@/entities/document'
import { DataResponse, useAxios } from '@/hooks/useAxios'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import classnames from 'classnames'
import frontCommonStyles from '../components/styles.module.css'
import { useTitle } from '@/hooks/useTitle'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const QADocumentsPage2 = () => {
  useTitle('Document Q&A System - Live Streaming')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<DocumentQaType>({ answer: '', sources: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const [document, setDocument] = useState<DocumentType>()
  const [page, setPage] = useState<number>()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const handleAskQuestion = async () => {
    if (!question.trim()) return
    
    setIsLoading(true)
    setAnswer({ answer: '', sources: [] })

    try {
      // Gunakan proxy route yang kita buat
      // const response = await fetch(`/api/portal/qa2?qa=${encodeURIComponent(question)}`)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://128.46.8.170:8030';
      const response = await fetch(`${API_BASE_URL}/api/portal/qa2?qa=${encodeURIComponent(question)}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          setIsLoading(false)
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            
            if (dataStr.trim()) {
              try {
                const data = JSON.parse(dataStr)
                
                if (data.success && data.data) {
                  setAnswer(prev => ({
                    ...prev,
                    answer: data.data.answer,
                    sources: data.data.sources || []
                  }))
                } else if (!data.success) {
                  console.error('Error from server:', data.message)
                }
              } catch (e) {
                console.error('Error parsing JSON:', e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching answer:', error)
      setAnswer(prev => ({
        ...prev,
        answer: prev.answer + `\n\nSorry, there was an error processing your question.`
      }))
      setIsLoading(false)
    }
  }

  const {
    isLoading: isLoadingDocument,
    statusCode: statusCodeDocument,
    data: dataDocument,
    fetch: fetchDocument,
  } = useAxios<DataResponse<DocumentType>, DocumentType>({
    url: '/api/portal/documents',
    method: 'get',
  })

  useEffect(() => {
    if (isLoadingDocument && statusCodeDocument === null) {
      return
    }

    if (statusCodeDocument === 200) {
      setDocument(dataDocument?.data)
      setOpen(true)
    }
  }, [isLoadingDocument, statusCodeDocument, dataDocument])

  const searchParams = useSearchParams()
  const q = searchParams.get('q')

  useEffect(() => {
    if (q) {
      setQuestion(q)
      // Auto-trigger question if query parameter exists
      setTimeout(() => {
        handleAskQuestion()
      }, 100)
    }
  }, [q])

  return (
    <Box
      className='bg-backgroundPaper'
      sx={{
        py: 4,
        minHeight: {
          xs: '100vh',
          md: '120vh',
          xl: '150vh',
        },
      }}
    >
      <section id='question' className='relative overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]'>
        <div className={classnames('flex flex-col gap-12 _plb-[100px]', frontCommonStyles.layoutSpacing)}>
          <div className='pbs-8 pbe-8 md:max-is-[800px] mlb-0 _mli-auto _text-center'>
            <Typography variant="h6" component="h1" gutterBottom>
              Document Q&A System - Live Streaming
            </Typography>
            <div className='mbs-4'>
              <TextField
                size="medium"
                fullWidth
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '36px !important',
                    backgroundColor: '#ffffff'
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '0.5rem 1rem !important'
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          edge='end'
                          onClick={handleAskQuestion}
                          disabled={isLoading}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isLoading ? 'ri-loader-4-line animate-spin' : 'ri-search-line text-primary'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Box sx={{ position: 'relative' }}>
        <Divider />
        {isLoading && (
          <LinearProgress
            color="primary"
            sx={{
              height: 2,
              borderRadius: 2,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
              },
            }}
          />
        )}
      </Box>

      <section id='answer' className='relative overflow-hidden pbs-8 _pbs-[70px] _-mbs-[70px] bg-backgroundPaper z-[1]'>
        {(answer.answer || isLoading) && (
          <div className={classnames('flex flex-col gap-2 _plb-[100px]', frontCommonStyles.layoutSpacing)}>
            <Typography variant="h6" gutterBottom>
              Answer :
            </Typography>
            <Typography sx={{ 
              whiteSpace: 'pre-wrap', 
              textAlign: 'justify',
              minHeight: '60px'
            }}>
              {answer.answer || 'Processing your question...'}
            </Typography>
            
            {answer.sources && answer.sources.length > 0 && (
              <Box className='flex flex-col gap-6' sx={{ mt: 8 }}>
                <Typography variant="h6" gutterBottom>
                  Sources :
                </Typography>
                {answer.sources.map((source, index) => (
                  <ListItemButton
                    key={index}
                    className='pbs-4 gap-6 p-4 rounded bg-actionHover'
                    sx={{ alignItems: 'flex-start' }}
                    onClick={() => {
                      fetchDocument({ url: `/api/portal/documents/${source.metadata.document_id}` })
                      setPage(source.metadata.page_number - 1)
                    }}
                  >
                    <ListItemAvatar>
                      <Box sx={{ mt: '4px' }}>
                        <i className="ri-article-fill text-2xl text-primary" />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${source.metadata?.title} - Page: ${source.metadata.page_number}`}
                      secondary={source.content}
                    />
                  </ListItemButton>
                ))}
              </Box>
            )}
          </div>
        )}
      </section>

      <section id='document' className='relative overflow-hidden pbs-[70px] _-mbs-[70px] bg-backgroundPaper z-[1]'>
        {document && (
          <Dialog fullWidth={true} maxWidth="xl" scroll="body" open={open!}>
            <DialogTitle>
              <Box
                sx={{
                  minWidth: '124px',
                  minHeight: '36px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Typography variant="h6" component="span">
                  {document.title}
                </Typography>
                <IconButton
                  color="error"
                  component="label"
                  onClick={() => {
                    setOpen(false)
                    setDocument(undefined)
                  }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ width: '100%', height: '950px' }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={`${process.env.NEXT_PUBLIC_APP_URL}${document?.url}`}
                  plugins={[defaultLayoutPluginInstance]}
                  defaultScale={1}
                  initialPage={page}
                />
              </Worker>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </Box>
  )
}

export default QADocumentsPage2