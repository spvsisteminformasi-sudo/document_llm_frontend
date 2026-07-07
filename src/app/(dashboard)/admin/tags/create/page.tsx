'use client'
// ** React Imports
import { useState, useEffect, SyntheticEvent, use } from 'react'

import { Box, Card, CardContent, CardHeader, FormLabel, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'

// ** Custom Table Components Imports
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormInput from '@core/components//form-input'
import {
    FormInputType,
    assignError,
    trimAll,
} from '@core/components//form-input/index.type'
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'
import type { TagType } from '@/entities/tag'

import { useAbility } from '@/hooks/useAbility'
import { LoadingButton } from '@mui/lab'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useMaster } from '@/hooks/useMaster'
import { useRouter } from 'next/navigation'
import type { DocumentType } from '@/entities/document'
import { useTitle } from '@/hooks/useTitle'

interface ListDocumentContentRequest extends ListRequest {
    document_id?: number
}

const CreateTagPage = () => {
    useTitle('Create Tag')
    // ** State
    const ability = useAbility()
    const { tag, fetchTag } = useMaster()
    const [documents, setDocuments] = useState<DocumentType[]>([])
    const router = useRouter()

    const {
        control,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm<TagType>()

    const {
        isLoading: isLoadingCreate,
        statusCode: statusCodeCreate,
        data: dataCreate,
        fetch: fetchCreate,
    } = useAxios<DataResponse<TagType>, TagType>({
        url: '/api/tags',
        method: 'post',
    })

    const {
        isLoading: isLoadingDocument,
        statusCode: statusCodeDocument,
        data: dataDocument,
        fetch: fetchDocument,
    } = useAxios<ListResponse<DocumentType>, ListRequest>({
        url: '/api/documents',
        method: 'get',
    })

    useEffect(() => {
        ability.checkPermission('create', 'tag')
        fetchTag()
        fetchDocument()
    }, [])

    useEffect(() => {
        if (isLoadingCreate && statusCodeCreate === null) {
            return
        }

        if (dataCreate?.success) {
            toast.success(dataCreate?.message!)
            router.push('/admin/tags')
        } else if (!dataCreate?.success && dataCreate?.message) {
            assignError(setError, dataCreate?.errors)
            toast.error(dataCreate?.message!)
        }
    }, [isLoadingCreate, statusCodeCreate, dataCreate])

    useEffect(() => {
        if (isLoadingDocument && statusCodeDocument === null) {
            return
        }

        if (statusCodeDocument === 200 && dataDocument?.data) {
            setDocuments(dataDocument.data)
        }
    }, [isLoadingDocument, statusCodeDocument, dataDocument])

    const onSubmit = (data: TagType) => {
        fetchCreate({ data: trimAll(data) })
    }
    return (
        <>
            <Card>
                <CardHeader title={'Create Tag'} />
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Tag</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <FormInput
                                        type={FormInputType.Input}
                                        name={'name'}
                                        control={control}
                                        rules={{ required: true }}
                                        placeholder={'Input Name'}
                                        error={errors.name}
                                        disabled={false}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Tag Type</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <FormInput
                                        type={FormInputType.AutoComplete}
                                        options={['folder', 'file']}
                                        optionLabel={(option: any) => option}
                                        name={'tag_type'}
                                        control={control}
                                        rules={{ required: false }}
                                        placeholder={'Input Tag Type'}
                                        labelShrink={true}
                                        error={errors.tag_type}
                                        disabled={false}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Document</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <FormInput
                                        type={FormInputType.AutoComplete}
                                        name={'document'}
                                        control={control}
                                        placeholder={'Pilih Document'}
                                        error={errors.document}
                                        options={documents}
                                        rules={{ required: false }}
                                        optionLabel={(option: any) => (typeof option === 'object') ? option.title : option}
                                        isOptionEqualToValue={(option, value) =>
                                            option.id === value.id
                                        }
                                        onInputChange={(val: string) => {
                                            fetchDocument({ data: { q: val } })
                                        }}
                                        onSelect={(data: DocumentType) => {
                                            if (data) {
                                                setValue('document_id', data.id!)
                                            }
                                        }}
                                        disabled={false}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Page Number</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <FormInput
                                        type={FormInputType.Number}
                                        name={'page_number'}
                                        control={control}
                                        rules={{ required: false }}
                                        placeholder={'Input Page Number'}
                                        error={errors.page_number}
                                        disabled={false}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={12}>
                                <Grid size={2}>
                                    <FormLabel>Parent</FormLabel>
                                </Grid>
                                <Grid size={10}>
                                    <Box sx={{}}>
                                        <RichTreeView items={tag} checkboxSelection
                                            getItemLabel={(item) => item.name}
                                            onSelectedItemsChange={(_, itemIds) => {
                                                setValue('parent_id', parseInt(`${itemIds}`))
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
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
        </>
    )
}


export default CreateTagPage
