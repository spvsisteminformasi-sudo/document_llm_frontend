'use client'
// ** React Imports
import { useState, useEffect, SyntheticEvent, useRef } from 'react'

import { 
    Box, 
    Card, 
    CardContent, 
    CardHeader, 
    FormLabel, 
    IconButton, 
    InputLabel, 
    Stack, 
    Tab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Autocomplete, 
    TextField
} from '@mui/material'

import { Controller, useForm } from 'react-hook-form';

import Grid from '@mui/material/Grid'

// ** Custom Table Components Imports
import Button from '@mui/material/Button'
// import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormInput from '@core/components//form-input'
import {
    FormInputType,
    assignError,
    trimAll,
} from '@core/components//form-input/index.type'

import { DataResponse, useAxios } from '@/hooks/useAxios'
import type { DocumentType } from '@/entities/document'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useAbility } from '@/hooks/useAbility'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMaster } from '@/hooks/useMaster'
import { useRouter } from 'next/navigation'
import PdfPreviewBtn from '@/@core/components/pdf-preview-btn'
import { useTitle } from '@/hooks/useTitle'

const CreateDocumentPage = () => {
    useTitle('Create Document')
    // ** State
    const ability = useAbility()
    const { tag, fetchTag } = useMaster()
    const router = useRouter()
    const fileInputLampiran = useRef<HTMLInputElement>(null)
    const [fileLampiran, setFileLampiran] = useState<any>()
    const [tab, setTab] = useState('1');
    const [openDialog, setOpenDialog] = useState(false);
    const [newDocumentId, setNewDocumentId] = useState<number | null>(null);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    }

    const {
        control,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm<DocumentType>()

    const {
        isLoading: isLoadingCreate,
        statusCode: statusCodeCreate,
        data: dataCreate,
        fetch: fetchCreate,
    } = useAxios<DataResponse<DocumentType>, DocumentType | FormData>({
        url: '/api/documents',
        method: 'post',
    })

    useEffect(() => {
        ability.checkPermission('create', 'document')
        fetchTag()
    }, [])

    useEffect(() => {
        if (isLoadingCreate && statusCodeCreate === null) {
            return
        }

        if (dataCreate?.success) {
            setNewDocumentId(dataCreate.data.id); // Asumsi response memiliki `data.id`
            setOpenDialog(true);
            toast.success(dataCreate?.message!)
            //router.push('/admin/documents')
        } else if (!dataCreate?.success && dataCreate?.message) {
            assignError(setError, dataCreate?.errors)
            toast.error(dataCreate?.message!)
        }
    }, [isLoadingCreate, statusCodeCreate, dataCreate])

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputLagi = () => {
        reset(); // Reset form react-hook-form
        setFileLampiran(undefined); // Hapus file lampiran
        if (fileInputLampiran.current) {
            fileInputLampiran.current.value = ''; // Reset input file
        }
        setNewDocumentId(null);
        handleCloseDialog();
    };

    const handleLihatDokumen = () => {
        if (newDocumentId) {
            router.push(`/admin/documents/edit/${newDocumentId}`); // Arahkan ke halaman edit
        }
        handleCloseDialog();
    };

    const handleLihatAll = () => {
        router.push('/admin/documents')
        handleCloseDialog();
    };

    const onSubmit = (data: DocumentType) => {
        const formData = new FormData()
        formData.append('title', data.title)
        if (fileLampiran) {
            formData.append('file', fileLampiran)
        }
        // Add metadata fields
        formData.append('document_type', data.document_type || '')
        formData.append('initiator', data.initiator || '')
        formData.append('number', data.number || '')
        formData.append('year', data.year?.toString() || '')
        formData.append('about', data.about || '')
        formData.append('place_of_determination', data.place_of_determination || '')
        formData.append('date_of_determination', data.date_of_determination || '')
        formData.append('official', data.official || '')
        formData.append('category_document', data.category_document || '')
        formData.append('status', 'queue')

        fetchCreate({ data: formData })
    }

    return (
        <>
            <Card>
                <CardHeader title={'Create Document'} />
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Document</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <FormInput
                                        type={FormInputType.TextArea}
                                        name={'title'}
                                        control={control}
                                        rules={{ required: true }}
                                        placeholder={'Input Title'}
                                        error={errors.title}
                                        disabled={false}
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Lampiran</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <input
                                        ref={fileInputLampiran}
                                        accept=".pdf"
                                        id={`inputfile-lampiran`}
                                        hidden
                                        type="file"
                                        onChange={(event: any) => {
                                            const file = event.target.files[0] ?? undefined
                                            setFileLampiran(file)
                                            setValue('title', file.name)
                                        }}
                                    />
                                    <IconButton color='primary' onClick={() => fileInputLampiran?.current?.click()}>
                                        <CloudUploadIcon />
                                    </IconButton>
                                    {fileLampiran ? (
                                        <>
                                            <PdfPreviewBtn
                                                title={`Download`}
                                                subtitle={`Lampiran.pdf`}
                                                url={URL.createObjectURL(fileLampiran)}
                                                local={true}
                                            />
                                            <IconButton
                                                onClick={() => {
                                                    setFileLampiran(undefined)
                                                }}
                                                sx={{ mt: -1 }}
                                                color='error'
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    ) : null}
                                </Grid>
                            </Grid>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Category</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <FormInput
                                        type={FormInputType.Select}
                                        options={['internal', 'eksternal']}
                                        optionLabel={(option: any) => option.toUpperCase()}
                                        name={'category_document'}
                                        control={control}
                                        rules={{ required: true }}
                                        placeholder={'Input Category'}
                                        labelShrink={true}
                                        error={errors.category_document}
                                        disabled={false}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ marginBottom: 5 }}>
                                <TabContext value={tab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                                            <Tab label="Metadata" value="1" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <Box sx={{ width: '100%', marginTop: 10 }}>
                                            <Grid container spacing={5}>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Jenis/Bentuk Peraturan</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        {/* <FormInput
                                                            type={FormInputType.Input}
                                                            name={'document_type'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input Jenis/Bentuk Peraturan'}
                                                            error={errors.document_type}
                                                            disabled={false}
                                                        /> */}                                                        
                                                        {/* <FormInput
                                                            type={FormInputType.Select}
                                                            options={[
                                                                'Peraturan Pemerintah',
                                                                'Peraturan Daerah',
                                                                'Peraturan Walikota',
                                                                'Peraturan Perusahaan',
                                                                'Peraturan Direksi',
                                                                'Keputusan Direksi',
                                                                'Surat Edaran',
                                                                'Dokumen Lainnya',
                                                            ]}
                                                            optionLabel={(option: any) => option.toUpperCase()}
                                                            name={'document_type'}
                                                            control={control}
                                                            rules={{ required: true }}
                                                            placeholder={'Input Jenis/Bentuk Peraturan'}
                                                            labelShrink={true}
                                                            error={errors.document_type}
                                                            disabled={false}
                                                            size="small"
                                                        /> */}
                                                        <Controller
                                                            name="document_type"
                                                            control={control}
                                                            rules={{ required: true }}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                {...field}
                                                                options={[
                                                                    'Peraturan Pemerintah',
                                                                    'Peraturan Daerah',
                                                                    'Peraturan Walikota',
                                                                    'Peraturan Perusahaan',
                                                                    'Peraturan Direksi',
                                                                    'Keputusan Direksi',
                                                                    'Surat Edaran',
                                                                    'Dokumen Lainnya',
                                                                ]}
                                                                value={field.value ?? null} 
                                                                onChange={(_, value) => field.onChange(value)}
                                                                renderInput={(params) => (
                                                                    <TextField 
                                                                        {...params} 
                                                                        variant="standard"
                                                                        // label="Input Jenis/Bentuk Peraturan" 
                                                                        // size="small" 
                                                                        error={!!errors.document_type} 
                                                                    />
                                                                )}
                                                                isOptionEqualToValue={(option, value) => option === value}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Pemrakarsa</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.Input}
                                                            name={'initiator'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Pemrakarsa Peraturan'}
                                                            error={errors.initiator}
                                                            disabled={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Nomor</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.Input}
                                                            name={'number'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input Nomor'}
                                                            error={errors.number}
                                                            disabled={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Tahun</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.Number}
                                                            name={'year'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input Tahun'}
                                                            error={errors.year}
                                                            align='left'
                                                            disabled={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Tentang</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.TextArea}
                                                            name={'about'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input About'}
                                                            error={errors.about}
                                                            disabled={false}
                                                            rows={3}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Tempat Penetapan</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.Input}
                                                            name={'place_of_determination'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input Tempat Penetapan'}
                                                            error={errors.place_of_determination}
                                                            disabled={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Tanggal Penetapan</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.DatePicker}
                                                            name={'date_of_determination'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input Tempat Penetapan'}
                                                            error={errors.date_of_determination}
                                                            disabled={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container size={12}>
                                                    <Grid size={2}>
                                                        <FormLabel>Pejabat yang Menetapkan</FormLabel>
                                                    </Grid>
                                                    <Grid size={10}>
                                                        <FormInput
                                                            type={FormInputType.Input}
                                                            name={'official'}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            placeholder={'Input Pejabat yang Menetapkan'}
                                                            error={errors.official}
                                                            disabled={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                            <Grid size={12}>
                                <Stack direction="row" spacing={2} justifyContent="flex-start">
                                    <LoadingButton
                                        id={'dialog-submit'}
                                        size="large"
                                        loading={isLoadingCreate}
                                        type="submit"
                                        variant="contained">
                                        Submit
                                    </LoadingButton>
                                    <Button
                                        id={'dialog-cancel'}
                                        size="large"
                                        variant="outlined"
                                        onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Sukses!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Dokumen berhasil disimpan. Apa yang ingin Anda lakukan selanjutnya?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInputLagi} color="primary">
                        Input Kembali
                    </Button>
                    <Button onClick={handleLihatAll} color="primary">
                        Lihat All Dokumen
                    </Button>
                    <Button onClick={handleLihatDokumen} color="primary" autoFocus>
                        Lihat Dokumen
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreateDocumentPage
