// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// ** Hooks Import

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(
    () => {
      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (pathname !== '/') {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
