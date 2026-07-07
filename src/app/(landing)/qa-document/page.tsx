'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  DialogContent,
  Dialog,
  IconButton,
  DialogTitle,
} from '@mui/material'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import { DataResponse, ListRequest, useAxios } from '@/hooks/useAxios'
import CloseIcon from '@mui/icons-material/Close'
import { DocumentQaType, SourceType } from '@/entities/document-qa'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import type { DocumentType } from '@/entities/document'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import toast from 'react-hot-toast'
import InputAdornment from '@mui/material/InputAdornment'
import classnames from 'classnames'
import frontCommonStyles from '../components/styles.module.css'
import { useTitle } from '@/hooks/useTitle'


const QADocumentsPage = () => {
  useTitle('Document Q&A System')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<DocumentQaType>({ answer: '', sources: [] })
  const [open, setOpen] = useState<boolean>(false)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const [document, setDocument] = useState<DocumentType>()
  const [page, setPage] = useState<number>()

  const handleAskQuestion = async () => {
    if (!question.trim()) return
    try {
      fetchDocumentQa()
    } catch (error) {
      console.error('Error fetching answer:', error)
      setAnswer({ ...answer, answer: 'Sorry, there was an error processing your question.' })
    }
  }

  const handleAskQuestion_live = async () => {
    if (!question.trim()) return
    setAnswer({ answer: '' , sources: [] })

    const response = await fetch(`/api/portal/qa?qa=${encodeURIComponent(question)}`)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      fullText += chunk
      setAnswer(prev => ({ ...prev, answer: fullText }))
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

  const {
    isLoading: isLoadingDocumentQa,
    statusCode: statusCodeDocumentQa,
    data: dataDocumentQa,
    fetch: fetchDocumentQa,
  } = useAxios<DataResponse<DocumentQaType>, ListRequest>({
    url: `/api/portal/qa?qa=${question}`,
  })

  useEffect(() => {
    if (isLoadingDocumentQa && statusCodeDocumentQa === null) {
      return
    }

    if (statusCodeDocumentQa === 200 && dataDocumentQa) {
      setAnswer(dataDocumentQa.data)
    }
  }, [isLoadingDocumentQa, statusCodeDocumentQa, dataDocumentQa])

  useEffect(() => {
    if (isLoadingDocument && statusCodeDocument === null) {
      return
    }

    if (statusCodeDocument === 200) {
      setDocument(dataDocument?.data)
      setOpen(true)
    } else if (!dataDocument?.success && dataDocument?.message) {
      toast.error(dataDocument?.message!)
    }
  }, [isLoadingDocument, statusCodeDocument, dataDocument])

  const searchParams = useSearchParams()
  const q = searchParams.get('q')

  useEffect(() => {
    if (q) {
      setQuestion(q)
      fetchDocumentQa({ url: `/api/portal/qa?qa=${q}` }) // langsung fetch
    }
  }, [])

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
      {/* <> */}
      <section id='question' className='relative overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]'>
        <div className={classnames('flex flex-col gap-12 _plb-[100px]', frontCommonStyles.layoutSpacing)}>
          <div className='pbs-8 pbe-8 md:max-is-[800px] mlb-0 _mli-auto _text-center'>
            <Typography variant="h6" component="h1" gutterBottom>
              Document Q&A System
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
                          loading={isLoadingDocumentQa}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isLoadingDocumentQa ? '' : 'ri-search-line text-primary'} />
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
      {/* <Divider /> */}
      <Box sx={{ position: 'relative' }}>
        <Divider />
        {isLoadingDocumentQa && (
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
        {answer && (
          <div className={classnames('flex flex-col gap-2 _plb-[100px]', frontCommonStyles.layoutSpacing)}>
            <Typography variant="h6" gutterBottom>
              Answer :
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
              {answer.answer}
            </Typography>
            {answer.sources && answer.sources.length > 0 && (
              <Box
                className='flex flex-col gap-6'
                sx={{ mt: 8 }}
              >
                <Typography variant="h6" gutterBottom>
                  Source :
                </Typography>
                {answer.sources.map((source, index) => (
                  <ListItemButton
                    key={index}
                    className='pbs-4 gap-6 p-4 rounded bg-actionHover'
                    sx={{ alignItems: 'flex-start' }}
                    onClick={() => {
                      fetchDocument({ url: `/api/portal/documents/${source.metadata.document_id}` })
                      setPage(source.metadata.page_number - 1)
                    }}>
                    <ListItemAvatar>
                      {/* <FolderIcon /> */}
                      <Box sx={{ mt: '4px' }}>
                        <i className="ri-article-fill text-2xl text-primary" />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${source.metadata?.title} Page: ${source.metadata.page_number}`}
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
      {/* </> */}
    </Box>
  )
}

export default QADocumentsPage
