// /home/usrepb/projects/labs/document_llm/frontend/src/app/(landing)/qa-webhook/page.tsx
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

const QAWebhook = () => {
  useTitle('Document Q&A System - Live Streaming')
  const [question, setQuestion] = useState('')
  // const [answer, setAnswer] = useState<DocumentQaType>({ answer: '', sources: [] })
  const [answer, setAnswer] = useState({ answer: '', sources: [] });
  const [chatId, setChatId] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const [document, setDocument] = useState<DocumentType>()
  const [page, setPage] = useState<number>()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  useEffect(() => {
    let sessionChatId = sessionStorage.getItem('n8n_chat_session');
    
    if (!sessionChatId) {
      // Buat ID unik baru jika belum ada di session storage
      sessionChatId = `chat_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('n8n_chat_session', sessionChatId);
    }
    
    setChatId(sessionChatId);
  }, []);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setAnswer({ answer: '', sources: [] });

    try {
      const N8N_URL = 'http://128.46.8.170:5678/webhook/3cd13150-ccda-4387-a6bb-45f83559e070';
      
      // Konfigurasi Basic Auth sesuai ENV Anda
      const username = 'admin'; // Sesuaikan dengan N8N_BASIC_AUTH_USER
      const password = 'passwordku'; // Sesuaikan dengan N8N_BASIC_AUTH_PASSWORD
      
      // Mengonversi kredensial ke format Base64 untuk header Authorization
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      const response = await fetch(N8N_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader // Menyertakan token Basic Auth
        },
        body: JSON.stringify({ 
          chatInput: question ,
          chatId: chatId // Menggunakan ID dari session browser
        }),
      });

      if (response.status === 401) {
        throw new Error('Gagal Autentikasi: Username atau Password n8n salah.');
      }

      const result = await response.json();
      
      setAnswer({
        answer: result.output || "Maaf, asisten tidak memberikan respon.",
        sources: [] 
      });

    } catch (error) {
      console.error('Error:', error);
      setAnswer({ 
        answer: `Kesalahan: ${error instanceof Error ? error.message : 'Gagal terhubung ke server'}`, 
        sources: [] 
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      <section id='answer' className='relative overflow-hidden pbs-8 bg-backgroundPaper z-[1]'>
        {(answer.answer || isLoading) && (
          <div className={classnames('flex flex-col gap-2', frontCommonStyles.layoutSpacing)}>
            <Typography variant="h6" gutterBottom>
              Asisten Virtual PDAM:
            </Typography>
            <Typography sx={{ 
              whiteSpace: 'pre-wrap', 
              textAlign: 'justify',
              minHeight: '60px',
              backgroundColor: '#f5f5f5',
              p: 4,
              borderRadius: '12px'
            }}>
              {answer.answer || 'Sedang memproses pertanyaan Anda...'}
            </Typography>
            
            {/* Bagian Sources di bawah ini dihapus/dihilangkan sesuai permintaan */}
          </div>
        )}
      </section>

      {/* Bagian section id='document' (Dialog PDF) juga bisa dihapus jika tidak digunakan lagi */}
    </Box>
  )
}

export default QAWebhook