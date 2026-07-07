'use client'

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Box, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/layout/shared/Logo';
import Pedoman from '@assets/png/Pedoman'
import { RegisterParams } from '@/context/types';
import { assignError, FormInputType } from '@/@core/components/form-input/index.type';
import toast from 'react-hot-toast';
import FormInput from '@/@core/components/form-input';
import { useTitle } from '@/hooks/useTitle';
const defaultValues = {
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    password_confirmation: ''
}

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    overflowY: 'auto',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function Register(props: { disableCustomTheme?: boolean }) {
    useTitle('Register')
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const auth = useAuth()

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterParams>({
        defaultValues
    })

    const onSubmit = (data: RegisterParams) => {
        setLoading(false)
        auth.register(data, (resp: any) => {
            const response = resp.response.data
            console.log(response)
            if (!response.success) {
                toast.error(response.message)
                assignError(setError, response.errors)
            } else {
                toast.success(response.message)
                router.push('/login')
            }
            setLoading(true)
        })
    }

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Box 
                    sx={{ 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        mx: 'auto'
                    }}>
                        <Pedoman height={100} />
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', my: 2 }}
                        >
                            Register
                        </Typography>
                    </Box>
                    <form
                        autoComplete='off'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-5'
                    >
                        <FormInput
                            type={FormInputType.Input}
                            name={'name'}
                            label='Name'
                            variant='outlined'
                            size='medium'
                            control={control}
                            rules={{ required: true }}
                            placeholder={'Input Name'}
                            error={errors.name}
                            disabled={false}
                        />

                        <FormInput
                            type={FormInputType.Input}
                            name={'username'}
                            label='Username'
                            variant='outlined'
                            size='medium'
                            control={control}
                            rules={{ required: true }}
                            placeholder={'Input Username'}
                            error={errors.username}
                            disabled={false}
                        />

                        <FormInput
                            type={FormInputType.Input}
                            name={'email'}
                            label='Email'
                            variant='outlined'
                            size='medium'
                            control={control}
                            rules={{ required: true }}
                            placeholder={'Input Email'}
                            error={errors.email}
                            disabled={false}
                        />
                        <FormInput
                            type={FormInputType.Input}
                            name={'phone'}
                            label='Phone'
                            variant='outlined'
                            size='medium'
                            control={control}
                            rules={{ required: true }}
                            placeholder={'Input Phone'}
                            error={errors.phone}
                            disabled={false}
                        />

                        <FormInput
                            type={FormInputType.Password}
                            name={'password'}
                            label='Password'
                            variant='outlined'
                            size='medium'
                            control={control}
                            rules={{ required: true }}
                            placeholder={'Input Password'}
                            error={errors.password}
                            disabled={false}
                        />

                        <FormInput
                            type={FormInputType.Password}
                            name={'password_confirmation'}
                            label='Password Confirmation'
                            control={control}
                            variant='outlined'
                            size='medium'
                            rules={{ required: true }}
                            placeholder={'Input Password Confirmation'}
                            error={errors.password_confirmation}
                            disabled={false}
                        />

                        <LoadingButton loading={loading} fullWidth variant='contained' type='submit'>
                            Register
                        </LoadingButton>
                        <div className='flex justify-center items-center flex-wrap gap-2'>
                            <Typography>Already have an account?</Typography>
                            <Typography
                                component={Link}
                                onClick={(e) => {
                                    e.preventDefault()
                                    router.push('/login')
                                }}
                                color='primary'
                                sx={{ cursor: 'pointer' }}
                            >
                                Sign in instead
                            </Typography>
                        </div>
                    </form>
                </Card>
            </SignInContainer>
        </>
    )
}
