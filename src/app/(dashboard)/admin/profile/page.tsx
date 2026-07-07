'use client'

import { Box, Card, CardContent, CardHeader, FormLabel, Stack, Tab } from '@mui/material'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormInput from '@core/components/form-input'
import { FormInputType, assignError } from '@core/components/form-input/index.type'
import { DataResponse, useAxios } from '@/hooks/useAxios'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useTitle } from '@/hooks/useTitle'

interface ProfileForm {
    name: string
    email: string
}

interface PasswordForm {
    current_password: string
    password: string
    password_confirmation: string
}

const ProfilePage = () => {
    useTitle('Profile')
    const [tab, setTab] = useState('1')
    const auth = useAuth()

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue)
    }

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        setError: setProfileError,
        formState: { errors: profileErrors },
    } = useForm<ProfileForm>({
        defaultValues: {
            name: auth.user?.name || '',
            email: auth.user?.email || ''
        }
    })

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
        url: '/api/profile',
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
        fetchProfile({ data })
        if (dataProfile?.success) {
            toast.success('Profile updated successfully')
            auth.setUser({ ...auth.user!, ...data })
        } else {
            assignError(setProfileError, dataProfile?.errors)
            toast.error(dataProfile?.message!)
        }
    }

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
        <Card>
            <CardHeader title={'Profile Settings'} />
            <CardContent>
                <Box sx={{ width: '100%' }}>
                    <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Account" value="1" />
                                <Tab label="Security" value="2" />
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
                                                disabled={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
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
                        <TabPanel value="2">
                            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                                <Grid container spacing={5} sx={{ mt: 5 }}>
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Current Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
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
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>New Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
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
                                    <Grid container size={12}>
                                        <Grid size={2}>
                                            <FormLabel>Confirm Password</FormLabel>
                                        </Grid>
                                        <Grid size={10}>
                                            <FormInput
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
                                    <Grid size={12}>
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
    )
}

export default ProfilePage
