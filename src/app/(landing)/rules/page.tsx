'use client'
// ** React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

import moment from 'moment'
// ** MUI Imports
import { GridColDef, GridSortModel } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Table Components Imports
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import DialogConfirm from '@core/components/dialog-confirm'
import DataGridLayout from '@core/components/datagrid-layout'
import { CellType } from '@core/components//datagrid-layout/index.type'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import type { DocumentType } from '@/entities/document'

import { useRouter } from 'next/navigation'
import { useTitle } from '@/hooks/useTitle'
const DocumentPage = () => {
    useTitle('Document')
    // ** State
    
    const [search, setSearch] = useState<string>('')
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [documents, setDocuments] = useState<DocumentType[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(25)
    const [selectedValue, setSelectedValue] = useState<DocumentType>()
    const router = useRouter()
    const {
        isLoading: isLoadingList,
        statusCode: statusCode,
        data: data,
        fetch: fetchDocument,
    } = useAxios<ListResponse<DocumentType>, ListRequest>({
        url: '/api/portal/documents',
    })

    useEffect(() => {
        fetchDocument({
            data: {
            sort: 'desc',
            field: 'date_of_determination',
            page: 1,
            per_page: pageSize,
            },
        })
    }, [])

    useEffect(() => {
        if (isLoadingList && statusCode === null) {
            return
        }

        if (statusCode === 200 && data?.data) {
            setDocuments(data.data)
            setTotal(data.total!)
            setPageSize(data.per_page!)
        }
    }, [isLoadingList, statusCode, data])

    const onFilterChange = useCallback((val: string) => {
        setSearch(val)
        fetchDocument({ data: { page: 1, q: val, per_page: pageSize } })
    }, [])

    const onSortChange = (sortModel: GridSortModel) => {
        if (sortModel.length !== 0) {
            fetchDocument({
                data: {
                    sort: sortModel[0].sort!,
                    field: sortModel[0].field,
                    page: 1,
                    per_page: pageSize,
                },
            })
        }
    }

    const onPaginationModelChange = (newPageSize: number, newPage: number) => {
        setPageSize(newPageSize)
        setPage(newPage)
        fetchDocument({ data: { page: ++newPage, q: search, per_page: newPageSize } })
    }

    const renderAction = (data: DocumentType) => (
        <Stack direction="row" sx={{ mt: 2 }} alignItems="center" spacing={1}>
            <IconButton
                onClick={() => {
                    router.push(`/article/${data.id}`)
                }}
                aria-label="edit"
                size="small"
            >
                <EditIcon fontSize="inherit" />
            </IconButton>
        </Stack>
    )

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'No',
            minWidth: 100,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.id}
                </Box>
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.title}
                </Box>
            ),
        },
        {
            field: 'document_type',
            headerName: 'Jenis Peraturan',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.document_type}
                </Box>
            ),
        },
        {
            field: 'initiator',
            headerName: 'Pemrakarsa',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.initiator}
                </Box>
            ),
        },
        {
            field: 'about',
            headerName: 'Tentang',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.about}
                </Box>
            ),
        }, 
        {
            field: 'date_of_determination',
            headerName: 'Tanggal Penetapan',
            minWidth: 150,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {moment(row?.date_of_determination).format('DD-MM-YYYY')}
                </Box>
            ),
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 150,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {moment(row?.created_at).format('DD-MM-YYYY H:m')}
                </Box>
            ),
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            minWidth: 150,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {moment(row?.updated_at).format('DD-MM-YYYY H:m')}
                </Box>
            ),
        },
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     align: 'center',
        //     headerAlign: 'center',
        //     minWidth: 150,
        //     renderCell: ({ row }: CellType<DocumentType>) => renderAction(row),
        // },
    ]

    const renderHeader = (
        <Grid container spacing={4}>
            <Grid size={6}>
                <TextField
                    fullWidth
                    size="small"
                    value={search}
                    variant="standard"
                    sx={{ mr: 4, mb: 2 }}
                    label="Search Nama Document"
                    onChange={e => onFilterChange(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>,
                    }}
                />
            </Grid>
        </Grid>
    )

    return (
        <>
        <section className='_md:plb-[100px] py-8 bg-backgroundPaper'>
            <div >
                <div className='flex flex-col text-center gap-2'>
                <Typography variant='h4'>Data Peraturan perundangan</Typography>
                <Typography>Silahkan cari peraturan perundang-undangan</Typography>
                </div>
            </div>
        </section>
        <section className='min-h-screen bg-backgroundPaper z-[1]'>
            <div className='container mx-auto px-4'>
            <DataGridLayout
                sx={{
                    '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                    }
                }}
                // title="Document"
                isLoadingList={isLoadingList}
                data={documents}
                header={renderHeader}
                columns={columns}
                rowCount={total}
                pageSize={pageSize}
                page={page}
                onSortChange={onSortChange}
                onPaginationModelChange={onPaginationModelChange}
                columnVisibilityModel={{
                    created_at: false,
                    created_by: false,
                    updated_at: false,
                    updated_by: false,
                }}
                onRowClick={(params) => {
                    const data = params.row as DocumentType
                    router.push(`/article/${data.id}`)
                }}
            />
            </div>
        </section>
        </>
    )
}


export default DocumentPage
