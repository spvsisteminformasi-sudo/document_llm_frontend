'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// MUI Components
import {
  Box,
  Typography,
  Breadcrumbs,
  Grid,
  Divider,
  InputAdornment,
  OutlinedInput,
  FormControl,
  FormLabel,
  Card,
  Skeleton
} from '@mui/material'

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
import { DataResponse, useAxios } from '@/hooks/useAxios'
import type { DocumentType } from '@/entities/document'
import { useAbility } from '@/hooks/useAbility'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// import ContentPage from '../../components/content'
import Preview from '@/app/(dashboard)/admin/documents/components/preview'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import TreeView from '../../components/TreeView'

// Styles Imports
import frontCommonStyles from './styles.module.css'
import type { Mode } from '@core/types'
import { useTitle } from '@/hooks/useTitle'

const Article = () => {
  useTitle('Article')
  // Props
  // Hooks

  // Refs
  const shadowRef = useRef(null)

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-ignore
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('scrolled')
    }
  }

  const ability = useAbility()
  const [document, setDocument] = useState<DocumentType>()
  const params = useParams()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('1');

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<DocumentType>()

  const {
    isLoading: isLoadingEdit,
    statusCode: statusCodeEdit,
    data: dataEdit,
    fetch: fetchEdit,
  } = useAxios<DataResponse<DocumentType>, DocumentType | FormData>({
    url: '/api/documents/' + params.id,
    method: 'put',
  })

  const {
    isLoading: isLoadingDocument,
    statusCode: statusCodeDocument,
    data: dataDocument,
    fetch: fetchDocument,
  } = useAxios<DataResponse<DocumentType>, DocumentType>({
    url: '/api/portal/documents/' + params.id,
    method: 'get',
  })

  useEffect(() => {
    ability.checkPermission('create', 'document')
    fetchDocument()
  }, [])

  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      setTab('2')
    }
  }, [searchParams])

  useEffect(() => {
    if (isLoadingEdit && statusCodeEdit === null) {
      return
    }

    if (dataEdit?.success) {
      toast.success(dataEdit?.message!)
      fetchDocument()
    } else if (!dataEdit?.success && dataEdit?.message) {
      assignError(setError, dataEdit?.errors)
      toast.error(dataEdit?.message!)
    }
  }, [isLoadingEdit, statusCodeEdit, dataEdit])

  useEffect(() => {
    if (isLoadingDocument && statusCodeDocument === null) {
      return
    }

    if (statusCodeDocument === 200) {
      setDocument(dataDocument?.data)
    } else if (!dataDocument?.success && dataDocument?.message) {
      toast.error(dataDocument?.message!)
    }
  }, [isLoadingDocument, statusCodeDocument, dataDocument])

  useEffect(() => {
    reset(document)
  }, [document])

  return (
    <section className='min-h-screen _relative _overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]'>
      <div className={classnames('container mx-auto px-4 py-8 md:py-16', frontCommonStyles.layoutSpacing)}>
        <Grid container spacing={6}>
          {/* Left Column */}
          <Grid size={{ xs: 12, lg: 4 }} className='flex flex-col gap-6'>
            <div className='_sticky _top-[70px]'>
              <Card elevation={2} className='p-4'>
                <FormControl fullWidth variant='outlined' className='mb-4'>
                  <OutlinedInput
                    className='rounded-lg'
                    placeholder='Search articles...'
                    onChange={(e) => {
                      console.log(e.target.value)
                      setQuery(e.target.value)
                    }}
                    startAdornment={
                      <InputAdornment position='start'>
                        <i className='ri-search-line text-textSecondary' />
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <div className='flex flex-col gap-3'>
                  <div className='p-3 bg-primary/5 rounded-lg'>
                    <Typography variant='h6' className='text-primary'>
                      Articles in this section
                    </Typography>
                  </div>
                  <div className='max-h-[600px] overflow-y-auto'>
                    <TreeView scrollMenu={scrollMenu} query={query} />
                  </div>
                </div>
              </Card>
            </div>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={3} className='p-6'>
              <div className='flex flex-col gap-4'>
                <Breadcrumbs aria-label='breadcrumb' className='opacity-75'>
                  <Link className='hover:text-primary transition-colors' href='/front-pages/help-center'>
                    Article
                  </Link>
                  <Typography className='text-textPrimary'>Document</Typography>
                </Breadcrumbs>
                {isLoadingDocument ? (
                  <Skeleton variant="text" width="70%" height={40} />
                ) : (
                  <Typography variant='h4' className='font-semibold'>{document?.title ?? ''}</Typography>
                )}
                <Typography variant='body2' className='text-textSecondary'>
                  {document?.date_of_determination ?? ''}
                </Typography>
              </div>

              <Divider className='my-6' />

              <div className='flex flex-col gap-6'>
                <Card variant="outlined" className='p-6 bg-background/50'>
                  <Typography variant='h6' className='mb-6 text-primary'>
                    Metadata Dokumen
                  </Typography>

                  <Box sx={{ width: '100%' }}>
                    <Grid container spacing={3}>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Jenis/Bentuk Peraturan</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'document_type'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Jenis/Bentuk Peraturan'}
                            error={errors.document_type}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Pemrakarsa</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'initiator'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Jenis/Bentuk Peraturan'}
                            error={errors.initiator}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Nomor</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'number'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Nomor'}
                            error={errors.number}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Tahun</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Number}
                            name={'year'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Tahun'}
                            error={errors.year}
                            align='right'
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Tentang</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'about'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input About'}
                            error={errors.about}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Tempat Penetapan</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'place_of_determination'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Tempat Penetapan'}
                            error={errors.place_of_determination}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Tanggal Penetapan</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.DatePicker}
                            name={'date_of_determination'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Tempat Penetapan'}
                            error={errors.date_of_determination}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Pejabat yang Menetapkan</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'official'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Pejabat yang Menetapkan'}
                            error={errors.official}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Status</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'status'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Status'}
                            error={errors.status}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Jumlah dilihat</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'view_count'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Jumlah dilihat'}
                            error={errors.view_count}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid container size={12}>
                        <Grid size={3}>
                          <FormLabel>Jumlah diDownload</FormLabel>
                        </Grid>
                        <Grid size={9}>
                          <FormInput
                            type={FormInputType.Input}
                            name={'download_count'}
                            control={control}
                            rules={{ required: false }}
                            placeholder={'Input Jumlah diDownload'}
                            error={errors.download_count}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>

                <Card variant="outlined" className='p-6'>
                  <Preview document={document} />
                </Card>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default Article
