// ** React Imports
import { ReactNode, ReactElement, useEffect, createContext } from 'react'

// ** Next Import
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// ** Hooks Import

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
  guest?: boolean
}

type GuestGuardContextProps = {
  guest: boolean
}

export const GuestGuardContext = createContext<GuestGuardContextProps | null>(null)

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback, guest } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router) {
      return
    }

    if (window.localStorage.getItem('userData') && !guest) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    //return fallback
  }

  return <>{children}</>
}

export default GuestGuard
