'use client'
import { Fragment, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { DataResponse, useAxios } from '@/hooks/useAxios'
import { ChatHistoryType } from '@/entities/chat-history'
import { Box, Chip, ListItemAvatar, ListItemButton } from '@mui/material'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import type { DocumentType } from '@/entities/document'
import CloseIcon from '@mui/icons-material/Close'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

interface ReferencesDialogProps {
    open: boolean
    onClose: () => void
    historyId?: number
}

const References = ({ open, onClose, historyId }: ReferencesDialogProps) => {
    const [chatHistory, setChatHistory] = useState<ChatHistoryType>()
    const [openDocument, setOpenDocument] = useState<boolean>(false)
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const [document, setDocument] = useState<DocumentType>()
    const [page, setPage] = useState<number>()

    const {
        isLoading,
        statusCode,
        data: chatHistoryData,
        fetch: fetchChatHistory,
    } = useAxios<DataResponse<ChatHistoryType>, ChatHistoryType>({
        url: `/api/chat-histories/${historyId}`,
        method: 'get',
    })

    const {
        isLoading: isLoadingDocument,
        statusCode: statusCodeDocument,
        data: dataDocument,
        fetch: fetchDocument,
    } = useAxios<DataResponse<DocumentType>, DocumentType>({
        url: '/api/documents',
        method: 'get',
    })

    useEffect(() => {
        if (open && historyId) {
            fetchChatHistory()
        }
    }, [open, historyId])

    useEffect(() => {
        if (isLoading && statusCode === null) return

        if (statusCode === 200 && chatHistoryData.data) {
            // Handle references data
            setChatHistory(chatHistoryData.data)
            console.log('References:', chatHistoryData.data)
        }
    }, [isLoading, statusCode, chatHistoryData])

    useEffect(() => {
        if (isLoadingDocument && statusCodeDocument === null) {
            return
        }

        if (statusCodeDocument === 200) {
            setDocument(dataDocument?.data)
            setOpenDocument(true)
        } else if (!dataDocument?.success && dataDocument?.message) {
            toast.error(dataDocument?.message!)
        }
    }, [isLoadingDocument, statusCodeDocument, dataDocument])

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <div className="flex justify-between items-center">
                        <Typography variant="h6">References</Typography>
                        <IconButton onClick={onClose} size="small">
                            <i className="ri-close-line" />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <section id='answer' className='relative overflow-hidden pbs-8 _pbs-[70px] _-mbs-[70px] bg-backgroundPaper z-[1]'>
                        {chatHistory && (
                            <div>
                                <Typography variant="h6" gutterBottom>
                                    Answer :
                                </Typography>
                                <ReactMarkdown>
                                    {chatHistory.answer}
                                </ReactMarkdown>
                                {chatHistory.sources && chatHistory.sources.length > 0 && (
                                    <Box
                                        className='flex flex-col gap-6'
                                        sx={{ mt: 2 }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            Referensi :
                                        </Typography>
                                        {chatHistory.sources.map((source, index) => (
                                            <ListItemButton
                                                key={index}
                                                className='pbs-4 gap-6 p-4 rounded bg-actionHover'
                                                sx={{ alignItems: 'flex-start' }}
                                                onClick={() => {
                                                    fetchDocument({ url: `/api/documents/${source.metadata.document_id}` })
                                                    setPage(source.metadata.page_number - 1)
                                                }}>
                                                <ListItemAvatar>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
            {document && (
                <Dialog fullWidth={true} maxWidth="xl" scroll="body" open={openDocument} onClose={() => setOpenDocument(false)}>
                    <DialogTitle>
                        <Box
                            sx={{
                                minWidth: '124px',
                                minHeight: '36px',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}>
                            <Typography variant="h6" component="span">
                                {document?.title}
                            </Typography>
                            <IconButton
                                color="error"
                                component="label"
                                onClick={() => {
                                    setOpenDocument(false)
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
        </>
    )
}

export default References
