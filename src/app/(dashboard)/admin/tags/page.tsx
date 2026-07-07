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
import { Box, styled, SvgIcon, SvgIconProps } from '@mui/material'
import Grid from '@mui/material/Grid'

// ** Custom Table Components Imports
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import DialogConfirm from '@core/components/dialog-confirm'
import DataGridLayout from '@core/components/datagrid-layout'
import { CellType } from '@core/components//datagrid-layout/index.type'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import type { TagType } from '@/entities/tag'

import { useAbility } from '@/hooks/useAbility'
import { useRouter } from 'next/navigation'
import { useTitle } from '@/hooks/useTitle'

const TagPage = () => {
    useTitle('Tag')
    // ** State
    const ability = useAbility()
    const [search, setSearch] = useState<string>('')
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [nama, setNama] = useState<TagType[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(25)
    const [selectedValue, setSelectedValue] = useState<TagType>()
    const router = useRouter()

    const {
        isLoading: isLoadingList,
        statusCode: statusCode,
        data: data,
        fetch: fetchTag,
    } = useAxios<ListResponse<TagType>, ListRequest>({
        url: '/api/tags',
    })

    const {
        isLoading: isLoadingDelete,
        statusCode: statusCodeDelete,
        data: dataDelete,
        fetch: fetchDelete,
    } = useAxios<DataResponse<TagType>, TagType>({
        url: `/api/tags/${selectedValue?.id}`,
        method: 'delete',
    })

    useEffect(() => {
        ability.checkPermission('read', 'tag')
        fetchTag()
    }, [])

    useEffect(() => {
        if (isLoadingList && statusCode === null) {
            return
        }

        if (statusCode === 200 && data?.data) {
            setNama(data.data)
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
            fetchTag()
            setSelectedValue(undefined)
            toast.success(dataDelete?.message!)
        } else if (dataDelete && !dataDelete?.success) {
            setOpenConfirm(false)
            toast.error(dataDelete?.message!)
        }
    }, [isLoadingDelete, statusCodeDelete, dataDelete])

    const onFilterChange = useCallback((val: string) => {
        setSearch(val)
        fetchTag({ data: { page: 1, q: val, per_page: pageSize } })
    }, [])

    const onSubmitDelete = () => {
        fetchDelete()
    }

    const onSortChange = (sortModel: GridSortModel) => {
        if (sortModel.length !== 0) {
            fetchTag({
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
        fetchTag({ data: { page: ++newPage, q: search, per_page: newPageSize } })
    }

    const renderAction = (data: TagType) => (
        <Stack direction="row" sx={{ mt: 2 }} alignItems="center" spacing={1}>
            {ability.can('update', 'Tag') ? (
                <IconButton
                    onClick={() => {
                        router.push(`/admin/tags/edit/${data.id}`)
                    }}
                    aria-label="edit"
                    size="small"
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
            ) : null}
            {ability.can('delete', 'Tag') ? (
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

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'No',
            minWidth: 100,
            filterable: false,
            renderCell: (index) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {index.api.getAllRowIds().indexOf(index.row.id) + 1 + page * pageSize}
                </Box>
            ),
        },
        {
            field: 'name',
            headerName: 'Tag',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<TagType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.name}
                </Box>
            ),
        },
        {
            field: 'parent',
            headerName: 'Parent',
            minWidth: 250,
            filterable: false,
            renderCell: ({ row }: CellType<TagType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.parent?.name}
                </Box>
            ),
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 150,
            filterable: false,
            renderCell: ({ row }: CellType<TagType>) => (
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
            renderCell: ({ row }: CellType<TagType>) => (
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
            renderCell: ({ row }: CellType<TagType>) => renderAction(row),
        },
    ]

    const renderHeader = (
        <Grid container spacing={4}>
            <Grid size={4}>
                {ability.can('create', 'Tag') ? (
                    <Button
                        onClick={() => {
                            router.push('/admin/tags/create')
                        }}
                        variant="contained"
                    >
                        Buat Tag
                    </Button>
                ) : null}
            </Grid>
            <Grid size={5} />
            <Grid size={3}>
                <TextField
                    fullWidth
                    size="small"
                    value={search}
                    variant="standard"
                    sx={{ mr: 4, mb: 2 }}
                    label="Search Nama Tag"
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
            <DataGridLayout
                title="Tag"
                isLoadingList={isLoadingList}
                data={nama}
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
            />
            <DialogConfirm
                title={`Konfirmasi hapus`}
                open={openConfirm}
                body={`Apakah anda yakin ingin menghapus data ini ${selectedValue?.name}`}
                onSubmit={onSubmitDelete}
                onCancel={() => setOpenConfirm(false)}
            />
        </>
    )
}


export default TagPage
