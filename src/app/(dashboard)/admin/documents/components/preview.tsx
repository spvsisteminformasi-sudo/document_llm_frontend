'use client'
// ** React Imports
import { Box } from '@mui/material'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import type { DocumentType } from '@/entities/document'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export type PreviewProps = {
    document?: DocumentType
}
const Preview = (props: PreviewProps) => {
    // ** State
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const { document } = props
    const [page, setPage] = useState<number>(0)
    const searchParams = useSearchParams()

    useEffect(() => {
        const page = searchParams.get('page')
        if (page) {
            setPage(parseInt(page) - 1)
        }
    }, [searchParams])

    return (
        <>
            <Box sx={{ width: '100%', marginTop: 5, height: '950px', }}>
                {document && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={`${process.env.NEXT_PUBLIC_APP_URL}${document?.url}`}
                            plugins={[defaultLayoutPluginInstance]}
                            defaultScale={1}
                            initialPage={page}
                            theme={{
                                theme: 'dark',
                            }}
                        />
                    </Worker>
                )}
            </Box>
        </>
    )
}

export default Preview
