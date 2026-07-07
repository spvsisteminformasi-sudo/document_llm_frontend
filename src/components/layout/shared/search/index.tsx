'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import { useParams, useRouter, usePathname } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import CloseIcon from '@mui/icons-material/Close'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
// Style Imports
import './styles.css'

// Data Imports
import data from './searchData'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import { Avatar, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { SourceType } from '@/entities/document-qa'
import toast from 'react-hot-toast'
import type { DocumentType } from '@/entities/document'

type SearchItemProps = {
  children: ReactNode
  shortcut?: string
  value: string
  url: string
  currentPath: string
  onSelect?: () => void
}


const NavSearch = () => {
  // States
  const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [items, setItems] = useState<SourceType[]>([])
  const [documentDetail, setDocumentDetail] = useState<DocumentType>()
  const [page, setPage] = useState<number>()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()

  const {
    isLoading: isLoadingDocumentContent,
    statusCode: statusCodeDocumentContent,
    data: dataDocumentContent,
    fetch: fetchDocumentContent,
  } = useAxios<ListResponse<SourceType>, ListRequest>({
    url: `/api/portal/document-search`,
  })

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
    if (isLoadingDocumentContent && statusCodeDocumentContent === null) {
      return
    }

    if (statusCodeDocumentContent === 200 && dataDocumentContent) {
      setItems(dataDocumentContent.data!)
    }
  }, [isLoadingDocumentContent, statusCodeDocumentContent, data])

  useEffect(() => {
    if (isLoadingDocument && statusCodeDocument === null) {
      return
    }

    if (statusCodeDocument === 200) {
      setDocumentDetail(dataDocument?.data)
      setOpenDetail(true)
    } else if (!dataDocument?.success && dataDocument?.message) {
      toast.error(dataDocument?.message!)
    }
  }, [isLoadingDocument, statusCodeDocument, dataDocument])

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleClose = () => {
    setOpen(false);
    setItems([])
  };

  // Reset the search value when the menu is closed
  useEffect(() => {
    if (!open && searchValue !== '') {
      setSearchValue('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      {isBreakpointReached || settings.layout === 'horizontal' ? (
        <IconButton className='text-textPrimary' onClick={() => {
          setItems([])
          setOpen(true)
        }
        }>
          <i className='ri-search-line' />
        </IconButton>
      ) : (
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => {
          setOpen(true)
          setItems([])
        }}>
          <IconButton className='text-textPrimary' onClick={() => {
            setOpen(true)
            setItems([])
          }}>
            <i className='ri-search-line' />
          </IconButton>
        </div>
      )}
      <Dialog
        open={open}
        onClose={() => handleClose()}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Stack direction={'row'}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="search"
              name="search"
              label="Keyword"
              fullWidth
              type="text"
              variant="standard"
              onChange={e => setSearchValue(e.target.value)}
              value={searchValue}
              placeholder="Search..."
            />
            <LoadingButton
              variant="contained"
              color="primary"
              sx={{ height: 36, marginTop: 5, marginLeft: 2 }}
              size={'small'}
              loading={isLoadingDocumentContent}
              onClick={() => {
                fetchDocumentContent({
                  data: {
                    q: searchValue
                  }
                })
              }}>Search</LoadingButton>
          </Stack>

        </DialogTitle>
        <DialogContent>
          <List
            sx={{ bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {items.map((source, index) => (
              <ListItemButton
                key={index}
                className='pbs-4 gap-6 p-4 rounded bg-actionHover'
                sx={{ alignItems: 'flex-start', mb: 2 }}
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
                  secondary={source.content.substring(0, 350) + (source.content.length > 100 ? '...' : '')}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {documentDetail && (
        <Dialog fullWidth={true} maxWidth="xl" scroll="body" open={openDetail!}>
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
                  setOpenDetail(false)
                  setDocumentDetail(undefined)
                }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ width: '100%', height: '950px' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={`${process.env.NEXT_PUBLIC_APP_URL}${documentDetail?.url}`}
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

export default NavSearch
