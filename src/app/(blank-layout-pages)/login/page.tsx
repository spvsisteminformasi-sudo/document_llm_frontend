'use client'

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
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
// import ReCAPTCHA from 'react-google-recaptcha'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Logo from '@/components/layout/shared/Logo';
import Pedoman from '@assets/png/Pedoman'
import { useTitle } from '@/hooks/useTitle'

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(5).required()
})

const defaultValues = {
    password: '',
    email: ''
}

interface FormLogin {
    email: string
    password: string
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
    // minHeight: '100dvh',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

export default function SignIn(props: { disableCustomTheme?: boolean }) {
    useTitle('Login')
    const [open, setOpen] = React.useState(false);
    // const [recaptcha, setRecaptcha] = useState<string>('')
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [rememberMe, setRememberMe] = React.useState<boolean>(true)
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const auth = useAuth()

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<FormLogin>({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onSubmit = (data: FormLogin) => {
        const { email, password } = data
        setLoading(true)
        auth.login({ email, password, rememberMe }, (error: any) => {
            const response = error.response.data
            if (!response.success) {
                setError('email', {
                    type: 'manual',
                    message: response?.message
                })
            }
            setLoading(false)
        })
    }

    React.useEffect(() => {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
    }, [])

    // const onReCAPTCHAChange = (token?: string | null) => {
    //     setRecaptcha(`${token}`)
    // }

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
                            sx={{ width: '100%', mt: 2 }}
                        >
                            Sign in
                        </Typography>
                    </Box>
                    <form
                        noValidate
                        autoComplete='off'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-5'
                        style={{
                            overflowY: 'auto',
                            maxHeight: '80vh', // batas tinggi form
                            padding: '1rem',
                        }}
                    >
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='email'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange, onBlur } }) => (
                                    <TextField
                                        autoFocus
                                        label='Email'
                                        value={value}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        error={Boolean(errors.email)}
                                        placeholder='Email'
                                    />
                                )}
                            />
                            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                                Password
                            </InputLabel>
                            <Controller
                                name='password'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange, onBlur } }) => (
                                    <OutlinedInput
                                        value={value}
                                        onBlur={onBlur}
                                        label='Password'
                                        onChange={onChange}
                                        id='auth-login-v2-password'
                                        error={Boolean(errors.password)}
                                        type={isPasswordShown ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    size='small'
                                                    edge='end'
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={e => e.preventDefault()}
                                                >
                                                    <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                )}
                            />
                            {errors.password && (
                                <FormHelperText sx={{ color: 'error.main' }} id=''>
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        
                        <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
                            <FormControlLabel
                                label='Remember Me'
                                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                            />
                            <Typography
                                className='text-end'
                                color='primary'
                                component={Link}
                                onClick={(e) => {
                                    e.preventDefault()
                                    router.push('/register')
                                }}
                            >
                                Forgot password?
                            </Typography>
                        </div>
                        <LoadingButton loading={loading} fullWidth variant='contained' type='submit'>
                            Log In
                        </LoadingButton>
                        <div className='flex justify-center items-center flex-wrap gap-2'>
                            <Typography>New on our platform?</Typography>
                            <Typography
                                component={Link}
                                onClick={(e) => {
                                    e.preventDefault()
                                    router.push('/register')
                                }}
                                color='primary'
                                sx={{ cursor: 'pointer' }}
                            >
                                Create an account
                            </Typography>
                        </div>
                    </form>
                </Card>
            </SignInContainer>
        </>
    );
}
