'use client'
// ** React Imports
import { useState, useEffect, useCallback } from 'react'

import moment from 'moment'
// ** MUI Imports
import { GridColDef, GridCellParams, GridSortModel, MuiEvent } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Box, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid'

// ** Custom Table Components Imports
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import DialogConfirm from '@core/components/dialog-confirm'
import DataGridLayout from '@core/components/datagrid-layout'
import { CellType } from '@core/components//datagrid-layout/index.type'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import type { DocumentType, DocumentFilterType } from '@/entities/document'
import { GridRowSelectionModel } from '@mui/x-data-grid'
import { useAbility } from '@/hooks/useAbility'
import { useRouter } from 'next/navigation'
import { useTitle } from '@/hooks/useTitle'
import { Select } from '@mui/material'
import { useTranslations } from 'next-intl'


const DocumentPage = () => {
    useTitle('Document')
    // ** State
    const ability = useAbility()
    const [search, setSearch] = useState<string>('')
    const t = useTranslations('document')
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [documents, setDocuments] = useState<DocumentType[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(25)
    const [selectedValue, setSelectedValue] = useState<DocumentType>()
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const router = useRouter()
    const [filter, setFilter] = useState({
        category_document: '',
        q: '',
    })
    const {
        isLoading: isLoadingList,
        statusCode: statusCode,
        data: data,
        fetch: fetchDocument,
    } = useAxios<ListResponse<DocumentType>, DocumentFilterType>({
        url: '/api/documents',
    })

    const {
        isLoading: isLoadingDelete,
        statusCode: statusCodeDelete,
        data: dataDelete,
        fetch: fetchDelete,
    } = useAxios<DataResponse<DocumentType>, DocumentType>({
        url: `/api/documents/${selectedValue?.id}`,
        method: 'delete',
    })

    const {
        isLoading: isLoadingPost,
        statusCode: statusCodePost,
        data: dataPost,
        fetch: fetchPost,
    } = useAxios<DataResponse<DocumentType>, { ids: number[] }>({
        url: '/api/documents?refresh=true',
        method: 'post',
    })

    useEffect(() => {
        ability.checkPermission('read', 'Document')
        fetchDocument()
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

    useEffect(() => {
        if (isLoadingDelete && statusCodeDelete === null) {
            return
        }
        if (dataDelete && dataDelete?.success) {
            setOpenConfirm(false)
            fetchDocument()
            setSelectedValue(undefined)
            toast.success(dataDelete?.message!)
        } else if (dataDelete && !dataDelete?.success) {
            setOpenConfirm(false)
            toast.error(dataDelete?.message!)
        }
    }, [isLoadingDelete, statusCodeDelete, dataDelete])

    useEffect(() => {
        if (isLoadingPost && statusCodePost === null) {
            return
        }
        if (dataPost && dataPost?.success) {
            toast.success(dataPost?.message!)
            fetchDocument()
            setSelectedIds([])
        } else if (dataPost && !dataPost?.success) {
            toast.error(dataPost?.message!)
        }
    }, [isLoadingPost, statusCodePost, dataPost])

    const onFilterChange = useCallback((key: string, val: string) => {
        setFilter({ ...filter, [key]: val })
    }, [])

    useEffect(() => {
        fetchDocument({ data: { page: 1, q: filter.q, per_page: pageSize, category_document: filter.category_document } })
    }, [filter])

    const onSubmitDelete = () => {
        fetchDelete()
    }

    const onSortChange = (sortModel: GridSortModel) => {
        if (sortModel.length !== 0) {
            fetchDocument({
                data: {
                    sort: sortModel[0].sort!,
                    field: sortModel[0].field,
                    page: 1,
                    per_page: pageSize,
                    category_document: filter.category_document,
                },
            })
        }
    }

    const onPaginationModelChange = (newPageSize: number, newPage: number) => {
        setPageSize(newPageSize)
        setPage(newPage)
        fetchDocument({ data: { page: ++newPage, q: filter.q, per_page: newPageSize, category_document: filter.category_document } })
    }

    const handlePostDocuments = () => {
        if (selectedIds.length === 0) {
            toast.error('Please select at least one document')
            return
        }
        fetchPost({ data: { ids: selectedIds } })
    }

    const handleCellClick = (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
        event.stopPropagation(); 
        if (params.field === '__check__' || params.field === 'actions') {
            return;
        }
        if (ability.can('update', 'Document')) {
            router.push(`/admin/documents/edit/${params.id}`);
        }
    };

    const renderAction = (data: DocumentType) => (
        <Stack direction="row" sx={{ mt: 2 }} alignItems="center" spacing={1}>
            {ability.can('update', 'Document') ? (
                <IconButton
                    onClick={() => {
                        router.push(`/admin/documents/edit/${data.id}`)
                    }}
                    aria-label="edit"
                    size="small"
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
            ) : null}
            {ability.can('delete', 'Document') ? (
                <IconButton
                    onClick={() => {
                        setSelectedValue(data)
                        setOpenConfirm(true)
                    }}
                    aria-label="delete"
                    size="small"
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            ) : null}
        </Stack>
    )

    const onSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedIds(newSelectionModel as number[])
    }

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
            field: 'original_filename',
            headerName: 'Filename',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.original_filename}
                </Box>
            ),
        },
        {
            field: 'category_document',
            headerName: 'Category',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.category_document}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<DocumentType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.status}
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
        {
            field: 'actions',
            headerName: 'Actions',
            align: 'center',
            headerAlign: 'center',
            minWidth: 150,
            renderCell: ({ row }: CellType<DocumentType>) => renderAction(row),
        },
    ]

    const renderHeader = (
        <Grid container spacing={4}>
            <Grid size={4}>
                <Stack direction="row" spacing={2}>
                    {ability.can('create', 'Document') ? (
                        <Button
                            onClick={() => {
                                router.push('/admin/documents/create')
                            }}
                            variant="contained"
                        >
                            {t('create')}
                        </Button>
                    ) : null}

                    {ability.can('create', 'Document') && selectedIds.length > 0 ? (
                        <Button
                            onClick={handlePostDocuments}
                            variant="contained"
                            color="secondary"
                        >
                            Refresh ({selectedIds.length})
                        </Button>
                    ) : null}
                </Stack>
            </Grid>
            <Grid size={2} />
            <Grid size={6}>
                <Stack direction="row" spacing={2}>
                    <Select
                        fullWidth
                        size="small"
                        variant="standard"
                        sx={{ mr: 4, mb: 2 }}
                        label="Search Category"
                        value={filter.category_document}
                        onChange={e => onFilterChange('category_document', e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="internal">Internal</MenuItem>
                        <MenuItem value="eksternal">Eksternal</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        sx={{ mr: 4, mb: 2 }}
                        label="Search"
                        value={filter.q}
                        onChange={e => onFilterChange('q', e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>,
                        }}
                    />
                </Stack>
            </Grid>
        </Grid>
    )

    return (
        <>
            <DataGridLayout
                title="Document"
                isLoadingList={isLoadingList}
                data={documents}
                header={renderHeader}
                columns={columns}
                rowCount={total}
                pageSize={pageSize}
                page={page}
                onSortChange={onSortChange}
                onPaginationModelChange={onPaginationModelChange}
                checkboxSelection
                keepNonExistentRowsSelected
                onSelectionModelChange={onSelectionModelChange}
                selectionModel={selectedIds}
                onCellClick={handleCellClick} // Gunakan handler yang baru
                sx={{
                    // Terapkan cursor pointer ke sel data, bukan ke kolom aksi/checkbox
                    '& .MuiDataGrid-cell:not(.MuiDataGrid-cell--checkbox, .MuiDataGrid-cell--withActions)': {
                        cursor: 'pointer'
                    }
                }}
                columnVisibilityModel={{
                    created_at: false,
                    created_by: false,
                    updated_at: false,
                    updated_by: false,
                }}
            />
            <DialogConfirm
                title={t('confirm.delete.title')}
                open={openConfirm}
                body={t('confirm.delete.message', { title: selectedValue?.title })}
                onSubmit={onSubmitDelete}
                onCancel={() => setOpenConfirm(false)}
            />
        </>
    )
}


export default DocumentPage
