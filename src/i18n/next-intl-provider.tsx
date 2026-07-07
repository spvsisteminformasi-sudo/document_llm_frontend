'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useEffect, useState } from 'react'

// Import messages
import enMessages from '@/i18n/locales/en.json'
import idMessages from '@/i18n/locales/id.json'

const messages = {
    en: enMessages,
    id: idMessages,
}

export default function NextIntlProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [locale, setLocale] = useState('en')

    useEffect(() => {
        const storedLocale = localStorage.getItem('NEXT_LOCALE') || 'en'
        setLocale(storedLocale)
    }, [])

    return (
        <NextIntlClientProvider 
            messages={messages[locale as keyof typeof messages]} 
            locale={locale}
            timeZone="Asia/Jakarta"
        >
            {children}
        </NextIntlClientProvider>
    )
} 
