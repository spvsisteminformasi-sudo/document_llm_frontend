'use client'
// ** React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

import moment from 'moment'
// ** MUI Imports
import { GridColDef, GridSortModel } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

// ** Custom Table Components Imports
import Button from '@mui/material/Button'
import { AbilityContext } from '@/@core/auth/Can'
import type { UserType } from '@/entities/user'
import { useMaster } from '@/hooks/useMaster'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import { useForm } from 'react-hook-form'
import { FormInputType, assignError, trimAll } from '@/@core/components/form-input/index.type'
import toast from 'react-hot-toast'
import FormInput from '@/@core/components/form-input'
import { CellType } from '@/@core/components/datagrid-layout/index.type'
import DataGridLayout from '@/@core/components/datagrid-layout'
import DialogForm from '@/@core/components/dialog-form'
import DialogConfirm from '@/@core/components/dialog-confirm'
import { Box, Grid } from '@mui/material'
import { useAbility } from '@/hooks/useAbility'
import { useTitle } from '@/hooks/useTitle'

const UserPage = () => {
    // ** State
    useTitle('User')
    const ability = useAbility()
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const [user, setUser] = useState<UserType[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(25)
    const [selectedValue, setSelectedValue] = useState<UserType>()

    const {
        isLoading: isLoadingList,
        statusCode: statusCode,
        data: data,
        fetch: fetchUser,
    } = useAxios<ListResponse<UserType>, ListRequest>({
        url: '/api/users',
    })


    const {
        control,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm<UserType>()

    const {
        isLoading: isLoadingCreate,
        statusCode: statusCodeCreate,
        data: dataCreate,
        fetch: fetchCreate,
    } = useAxios<DataResponse<UserType>, UserType>({
        url:
            '/api/users' +
            (selectedValue?.id !== undefined ? `/${selectedValue?.id}` : ''),
        method: selectedValue?.id === undefined ? 'post' : 'put',
    })


    const {
        isLoading: isLoadingDelete,
        statusCode: statusCodeDelete,
        data: dataDelete,
        fetch: fetchDelete,
    } = useAxios<DataResponse<UserType>, UserType>({
        url: `/api/users/${selectedValue?.id}`,
        method: 'delete',
    })

    useEffect(() => {
        ability.checkPermission('read', 'user')
        fetchUser()
    }, [])

    useEffect(() => {
        if (!open) {
            setSelectedValue(undefined)
            reset({})
        }
    }, [open])

    useEffect(() => {
        if (isLoadingList && statusCode === null) {
            return
        }

        if (statusCode === 200 && data?.data) {
            setUser(data.data)
            setTotal(data.total!)
            setPageSize(data.per_page!)
        }
    }, [isLoadingList, statusCode, data])

    useEffect(() => {
        if (isLoadingCreate && statusCodeCreate === null) {
            return
        }

        if (dataCreate?.success) {
            setOpen(false)
            fetchUser()
            setSelectedValue(undefined)
            toast.success(dataCreate?.message!)
        } else if (!dataCreate?.success && dataCreate?.message) {
            assignError(setError, dataCreate?.errors)
            toast.error(dataCreate?.message!)
        }
    }, [isLoadingCreate, statusCodeCreate, dataCreate])

    useEffect(() => {
        if (isLoadingDelete && statusCodeDelete === null) {
            return
        }
        if (dataDelete && dataDelete?.success) {
            setOpenConfirm(false)
            fetchUser()
            setSelectedValue(undefined)
            toast.success(dataDelete?.message!)
        } else if (dataDelete && !dataDelete?.success) {
            setOpenConfirm(false)
            toast.error(dataDelete?.message!)
        }
    }, [isLoadingDelete, statusCodeDelete, dataDelete])

    const onFilterChange = useCallback((val: string) => {
        setSearch(val)
        fetchUser({ data: { page: 1, q: val, per_page: pageSize } })
    }, [])

    const onSubmit = (data: UserType) => {
        fetchCreate({ data: trimAll(data) })
    }

    const onSubmitDelete = () => {
        fetchDelete()
    }

    const onSortChange = (sortModel: GridSortModel) => {
        if (sortModel.length !== 0) {
            fetchUser({
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
        fetchUser({ data: { page: ++newPage, q: search, per_page: newPageSize } })
    }

    const renderForm = (
        <Grid container spacing={5}>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.Input}
                    name={'name'}
                    label={'Full Name'}
                    control={control}
                    rules={{ required: true }}
                    placeholder={'Input Full Name'}
                    error={errors.name}
                    disabled={false}
                />
            </Grid>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.Input}
                    name={'username'}
                    label={'Username'}
                    control={control}
                    rules={{ required: true }}
                    placeholder={'Input Username'}
                    error={errors.username}
                    disabled={false}
                />
            </Grid>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.Input}
                    name={'phone'}
                    label={'Phone'}
                    control={control}
                    rules={{ required: true }}
                    placeholder={'Input Phone'}
                    error={errors.phone}
                    disabled={false}
                />
            </Grid>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.Input}
                    name={'email'}
                    label={'Email'}
                    control={control}
                    rules={{ required: true }}
                    placeholder={'Input Email'}
                    error={errors.email}
                    disabled={false}
                />
            </Grid>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.AutoComplete}
                    name={'role'}
                    control={control}
                    label='Role'
                    placeholder={'Role'}
                    error={errors.roles}
                    options={['Admin', 'User', 'Guest']}
                    optionLabel={(option: any) => option}
                    isOptionEqualToValue={(option, value) =>
                        option === value
                    }
                    disabled={false}
                />
            </Grid>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.Password}
                    name={'password'}
                    label={'Password'}
                    control={control}
                    placeholder={'Input Password'}
                    error={errors.password}
                    disabled={false}
                />
            </Grid>
            <Grid size={12}>
                <FormInput
                    type={FormInputType.Password}
                    name={'password_confirmation'}
                    label={'Password Confirmation'}
                    control={control}
                    placeholder={'Input Password Confirmation'}
                    error={errors.password_confirmation}
                    disabled={false}
                />
            </Grid>
        </Grid>
    )

    const renderAction = (data: UserType) => (
        <Stack direction="row" sx={{ mt: 2 }} alignItems="center" spacing={1}>
            {ability.can('update', 'user') ? (
                <IconButton
                    onClick={() => {
                        setSelectedValue(data)
                        reset(data)
                        setOpen(true)
                    }}
                    aria-label="edit"
                    size="small"
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
            ) : null}
            {ability.can('delete', 'user') ? (
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
            flex: 1,
            renderCell: (index) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {index.api.getAllRowIds().indexOf(index.row.id) + 1 + page * pageSize}
                </Box>
            ),
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 250,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.name}
                </Box>
            ),
        },
        {
            field: 'phone',
            headerName: 'Phone',
            minWidth: 250,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.phone}
                </Box>
            ),
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 250,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.email}
                </Box>
            ),
        },
        {
            field: 'roles',
            headerName: 'Roles',
            minWidth: 150,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.role}
                </Box>
            ),
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 150,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {moment(row?.created_at).format('DD-MM-YYYY H:m')}
                </Box>
            ),
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            minWidth: 150,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.created_by}
                </Box>
            ),
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            minWidth: 150,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {moment(row?.updated_at).format('DD-MM-YYYY H:m')}
                </Box>
            ),
        },
        {
            field: 'updated_by',
            headerName: 'Updated By',
            minWidth: 150,
            filterable: false,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => (
                <Box component="span" sx={{ typography: 'body2', whiteSpace: 'nowrap' }}>
                    {row?.updated_by}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            align: 'center',
            headerAlign: 'center',
            minWidth: 150,
            flex: 1,
            renderCell: ({ row }: CellType<UserType>) => renderAction(row),
        },
    ]

    const renderHeader = (
        <Grid container spacing={4}>
            <Grid size={3}>
                {ability.can('create', 'user') ? (
                    <Button
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                            reset({})
                            setOpen(true)
                        }}
                        variant="contained"
                    >
                        Tambah User
                    </Button>
                ) : null}
            </Grid>
            <Grid size={6} />
            <Grid size={3}>
                <TextField
                    fullWidth
                    size="small"
                    value={search}
                    variant="standard"
                    sx={{ mr: 4, mb: 2 }}
                    label="Search User"
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
                title="User"
                isLoadingList={isLoadingList}
                data={user}
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
            <DialogForm
                title={
                    selectedValue !== undefined ? 'Edit User' : 'New User'
                }
                open={open}
                fullWidth={true}
                loading={isLoadingCreate}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onCancel={() => setOpen(false)}
            >
                {renderForm}
            </DialogForm>
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

export default UserPage
