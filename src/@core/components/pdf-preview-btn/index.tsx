// ** React Imports

// ** MUI Imports
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import DownloadIcon from '@mui/icons-material/Download'
import { PdfPreviewBtnType } from './index.type'

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { useState } from 'react'
import authConfig from '@configs/auth'

const PdfPreviewBtn = (props: PdfPreviewBtnType) => {
    const { title, url, local } = props
    const [open, setOpen] = useState<boolean>(false)
    const defaultLayoutPluginInstance = defaultLayoutPlugin()

    const buildUrlReporting = () => {
        if (local === false) {
            const authToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
            return `${process.env.NEXT_PUBLIC_BASE_URL}/api${url}?token=${authToken}&response=lampiran`
        } else {
            return url
        }
    }

    const renderPreviewDialog = (
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
                        {title}
                    </Typography>
                    <IconButton
                        color="error"
                        component="label"
                        onClick={() => {
                            setOpen(false)
                        }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ minHeight: '75vh', maxHeight: '700px', overflow: 'auto' }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                        fileUrl={`${buildUrlReporting()}`}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={1}
                        theme={{
                            theme: 'dark',
                        }}
                    />
                </Worker>
            </DialogContent>
        </Dialog>
    )

    return (
        <>
            {open && renderPreviewDialog}
            {
                <IconButton
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    <DownloadIcon />
                </IconButton>
            }
        </>
    )
}

export default PdfPreviewBtn
