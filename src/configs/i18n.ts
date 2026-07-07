export const i18n = {
  defaultLocale: 'id',
  locales: ['id','en', 'fr', 'ar'],
  langDirection: {
    id: 'ltr',
    en: 'ltr',
    fr: 'ltr',
    ar: 'rtl'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
