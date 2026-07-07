'use client'
// ** React Imports
import { useState, useEffect } from 'react'

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
import { useParams, useRouter } from 'next/navigation'
import type { DocumentType } from '@/entities/document'
import { useTitle } from '@/hooks/useTitle'
interface ListDocumentContentRequest extends ListRequest {
    document_id?: number
}

const TagPage = () => {
    useTitle('Edit Tag')
    // ** State
    const ability = useAbility()
    const { tag, fetchTag } = useMaster()
    const params = useParams()
    const [selectedTag, setSelectedTag] = useState<TagType>()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const router = useRouter()
    const [documents, setDocuments] = useState<DocumentType[]>([])

    const {
        control,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm<TagType>()

    const {
        isLoading: isLoadingEdit,
        statusCode: statusCodeEdit,
        data: dataEdit,
        fetch: fetchEdit,
    } = useAxios<DataResponse<TagType>, TagType>({
        url: '/api/tags/' + params.id,
        method: 'put',
    })

    const {
        isLoading: isLoadingTag,
        statusCode: statusCodeTag,
        data: dataTag,
        fetch: fetchSelectedTag,
    } = useAxios<DataResponse<TagType>, TagType>({
        url: '/api/tags/' + params.id,
        method: 'get',
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
        if (isLoadingTag && statusCodeTag === null) {
            return
        }

        if (statusCodeTag === 200) {
            setSelectedTag(dataTag?.data)
        } else if (!dataTag?.success && dataTag?.message) {
            toast.error(dataTag?.message!)
        }
    }, [isLoadingTag, statusCodeTag, dataTag])

    useEffect(() => {
        if (isLoadingDocument && statusCodeDocument === null) {
            return
        }

        if (statusCodeDocument === 200 && dataDocument?.data) {
            setDocuments(dataDocument.data)
        }
    }, [isLoadingDocument, statusCodeDocument, dataDocument])

    useEffect(() => {
        ability.checkPermission('create', 'tag')
        fetchTag()
        fetchSelectedTag()
        fetchDocument()
    }, [])

    useEffect(() => {
        if (isLoadingEdit && statusCodeEdit === null) {
            return
        }

        if (dataEdit?.success) {
            toast.success(dataEdit?.message!)
            router.push('/admin/tags')
        } else if (!dataEdit?.success && dataEdit?.message) {
            assignError(setError, dataEdit?.errors)
            toast.error(dataEdit?.message!)
        }
    }, [isLoadingEdit, statusCodeEdit, dataEdit])

    useEffect(() => {
        if (selectedTag) {
            reset(selectedTag)
            setSelectedItems([selectedTag?.parent_id?.toString()])
        }
    }, [selectedTag])

    const handleSelectedItemsChange = (event: React.SyntheticEvent, itemIds: string[]) => {
        setSelectedItems(itemIds!);
        setValue('parent_id', parseInt(`${itemIds}`));
    };

    const onSubmit = (data: TagType) => {
        fetchEdit({ data: trimAll(data) })
    }

    return (
        <>
            <Card>
                <CardHeader title={'Edit Tag'} />
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
                                        type={FormInputType.Select}
                                        options={['folder', 'file']}
                                        optionLabel={(option: any) => option}
                                        name={'tag_type'}
                                        control={control}
                                        rules={{ required: true }}
                                        placeholder={'Input Name'}
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
                                        <RichTreeView
                                            items={tag}
                                            checkboxSelection
                                            getItemLabel={(item) => item.name}
                                            selectedItems={selectedItems}
                                            defaultSelectedItems={selectedItems}
                                            onSelectedItemsChange={handleSelectedItemsChange}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid size={12}>
                                <Stack direction="row" spacing={2} justifyContent="flex-start">
                                    <LoadingButton
                                        id={'dialog-submit'}
                                        size="large"
                                        loading={isLoadingEdit}
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


export default TagPage
