'use client'

import { useLocale } from 'next-intl'
import { Button, ButtonGroup } from '@mui/material'
import { useEffect, useState } from 'react'

export default function LanguageSwitcher() {
    const [currentLocale, setCurrentLocale] = useState('en')

    useEffect(() => {
        const storedLocale = localStorage.getItem('NEXT_LOCALE') || 'en'
        setCurrentLocale(storedLocale)
    }, [])

    const switchLanguage = (newLocale: string) => {
        localStorage.setItem('NEXT_LOCALE', newLocale)
        window.location.reload()
    }

    return (
        <ButtonGroup variant="outlined" size="small">
            <Button
                onClick={() => switchLanguage('en')}
                variant={currentLocale === 'en' ? 'contained' : 'outlined'}
            >
                EN
            </Button>
            <Button
                onClick={() => switchLanguage('id')}
                variant={currentLocale === 'id' ? 'contained' : 'outlined'}
            >
                ID
            </Button>
        </ButtonGroup>
    )
} 
