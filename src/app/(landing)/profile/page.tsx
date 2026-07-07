'use client'

import { Box, Card, CardContent, CardHeader, FormLabel, Stack, Tab } from '@mui/material'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormInput from '@core/components/form-input'
import { FormInputType, assignError } from '@core/components/form-input/index.type'
import { DataResponse, useAxios } from '@/hooks/useAxios'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { useTitle } from '@/hooks/useTitle'

interface ProfileForm {
    name: string
    email: string 
    phone: string
    username: string
    role: string
    password: string
    password_confirmation: string
}

interface PasswordForm {
    current_password: string
    password: string
    password_confirmation: string
}

const ProfilePage = () => {
    useTitle('Profile')
    const [tab, setTab] = useState('1')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedData, setSubmittedData] = useState<ProfileForm | null>(null)
    const auth = useAuth()

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue)
    }

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        setError: setProfileError,
        formState: { errors: profileErrors },
        reset: resetProfileForm,
        watch,
    } = useForm<ProfileForm>({
        defaultValues: {
            name: auth.user?.name || '',
            email: auth.user?.email || '',
            phone: auth.user?.phone || '',
            username: auth.user?.username || '',
            role: auth.user?.role || '',
            password: '',
            password_confirmation: ''
        }
    })

    const passwordValue = watch('password')

    useEffect(() => {
        if (auth.user) {
            resetProfileForm({
                name: auth.user.name || '',
                email: auth.user.email || '',
                phone: auth.user.phone || '',
                username: auth.user.username || '',
                role: auth.user.role || '',
                password: '',
                password_confirmation: ''
            })
        }
    }, [auth.user, resetProfileForm])
    
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        setError: setPasswordError,
        formState: { errors: passwordErrors },
    } = useForm<PasswordForm>()

    const {
        isLoading: isLoadingProfile,
        data: dataProfile,
        fetch: fetchProfile,
    } = useAxios<DataResponse<ProfileForm>, ProfileForm>({
        url: `/api/users/${auth.user?.id}`,
        method: 'put',
    })

    const {
        isLoading: isLoadingPassword,
        data: dataPassword,
        fetch: fetchPassword,
    } = useAxios<DataResponse<PasswordForm>, PasswordForm>({
        url: '/api/profile/password',
        method: 'put',
    })

    const onProfileSubmit = (data: ProfileForm) => {
        const payload = { ...data }
        if (!payload.password) {
            delete payload.password
            delete payload.password_confirmation
        }

        setSubmittedData(payload as ProfileForm)
        setIsSubmitted(true)
        fetchProfile({ data: payload })
    }

    useEffect(() => {
        if (!dataProfile || !isSubmitted) return

        if (dataProfile.success) {
            toast.success('Profil berhasil diperbarui')
            if (submittedData) {
                auth.setUser({ ...auth.user!, ...submittedData })
                resetProfileForm({ ...submittedData, password: '', password_confirmation: '' })
            }
        } else {
            assignError(setProfileError, dataProfile.errors)
            toast.error(dataProfile.message || 'Gagal menyimpan profil')
        }

        setIsSubmitted(false) // reset
    }, [dataProfile, isSubmitted])
    
    const onPasswordSubmit = (data: PasswordForm) => {
        fetchPassword({ data })
        if (dataPassword?.success) {
            toast.success('Password updated successfully')
        } else {
            assignError(setPasswordError, dataPassword?.errors)
            toast.error(dataPassword?.message!)
        }
    }

    return (
    <section className='min-h-screen _relative _overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]'>
        <div className='container mx-auto px-4 py-8 md:py-16'>
        <Card>
            <CardHeader title={'Profile Settings'} />
            <CardContent>
                <Box sx={{ width: '100%' }}>
                    <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Account" value="1" />
                                <Tab sx={{ display: 'none' }} label="Security" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                                <Grid container spacing={5} sx={{ mt: 5 }}>
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Name</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                type={FormInputType.Input}
                                                name={'name'}
                                                control={profileControl}
                                                rules={{ required: true }}
                                                placeholder={'Input Name'}
                                                error={profileErrors.name}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Username</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                type={FormInputType.Input}
                                                name={'username'}
                                                control={profileControl}
                                                rules={{ required: true }}
                                                placeholder={'Input username'}
                                                error={profileErrors.username}
                                                disabled={true}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Email</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                type={FormInputType.Input}
                                                name={'email'}
                                                control={profileControl}
                                                rules={{ required: true }}
                                                placeholder={'Input Email'}
                                                error={profileErrors.email}
                                                disabled={true}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid sx={{ display: 'none' }} container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Role</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                type={FormInputType.Input}
                                                name={'role'}
                                                control={profileControl}
                                                rules={{ required: true }}
                                                placeholder={'Input role'}
                                                error={profileErrors.role}
                                                disabled={true}
                                            />
                                        </Grid>
                                    </Grid>
                                    
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Telepon</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                type={FormInputType.Input}
                                                name={'phone'}
                                                control={profileControl}
                                                rules={{ required: true }}
                                                placeholder={'Input phone'}
                                                error={profileErrors.phone}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" size={12}>
                                        <Grid size={2}>
                                            <FormLabel>New Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                variant='outlined'
                                                type={FormInputType.Password}
                                                name={'password'}
                                                control={profileControl}
                                                rules={{
                                                    validate: value =>
                                                    !value || value.length >= 6 || 'Password harus minimal 6 karakter'
                                                }}
                                                placeholder={'Input New Password'}
                                                error={profileErrors.password}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Confirm Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                variant='outlined'
                                                type={FormInputType.Password}
                                                name={'password_confirmation'}
                                                control={profileControl}
                                                rules={{
                                                    validate: (value) => {
                                                    if (!value) return true
                                                    if (value.length < 6) return 'Konfirmasi password minimal 6 karakter'
                                                    if (value !== profileControl._formValues.password)
                                                        return 'Konfirmasi password tidak cocok'
                                                    return true
                                                    }
                                                }}
                                                placeholder={'Confirm New Password'}
                                                error={profileErrors.password_confirmation}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid sx={{ mt: 5 }} size={12}>
                                        <Stack direction="row" spacing={2}>
                                            <LoadingButton
                                                loading={isLoadingProfile}
                                                type="submit"
                                                variant="contained"
                                            >
                                                Save Changes
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </form>
                        </TabPanel>
                        <TabPanel sx={{ display: 'none' }} value="2">
                            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                                <Grid container spacing={5} sx={{ mt: 5 }}>
                                    <Grid container alignItems="center" size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Current Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                variant='outlined'
                                                type={FormInputType.Password}
                                                name={'current_password'}
                                                control={passwordControl}
                                                rules={{ required: true }}
                                                placeholder={'Input Current Password'}
                                                error={passwordErrors.current_password}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" size={12}>
                                        <Grid size={2}>
                                            <FormLabel>New Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                variant='outlined'
                                                type={FormInputType.Password}
                                                name={'password'}
                                                control={passwordControl}
                                                rules={{ required: true }}
                                                placeholder={'Input New Password'}
                                                error={passwordErrors.password}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Confirm Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
                                                variant='outlined'
                                                type={FormInputType.Password}
                                                name={'password_confirmation'}
                                                control={passwordControl}
                                                rules={{ required: true }}
                                                placeholder={'Confirm New Password'}
                                                error={passwordErrors.password_confirmation}
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid sx={{ mt: 5 }} size={12}>
                                        <Stack direction="row" spacing={2}>
                                            <LoadingButton
                                                loading={isLoadingPassword}
                                                type="submit"
                                                variant="contained"
                                            >
                                                Change Password
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </form>
                        </TabPanel>
                    </TabContext>
                </Box>
            </CardContent>
        </Card>
        </div>
    </section>
    )
}

export default ProfilePage
