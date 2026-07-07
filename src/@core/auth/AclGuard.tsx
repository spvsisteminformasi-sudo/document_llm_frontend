// ** React Imports
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

// ** Next Import
import { usePathname, useRouter } from 'next/navigation'

// ** Types

// ** Hooks

// ** Util Import
import { buildAbilityFor, type ACLObj, type AppAbility } from '@/configs/acl'
import { useAuth } from '@/hooks/useAuth'
import { AbilityContext } from './Can'
import Spinner from '../spinner'
import BlankLayout from '@/@layouts/BlankLayout'
import { getSystemMode } from '../utils/serverHelpers'
import Forbidden from '@/views/Forbidden'

interface AclGuardProps {
    children: ReactNode
    authGuard?: boolean
    guestGuard?: boolean
}

interface AccessControlType {
    aclAbilities?: ACLObj
    setAclAbilities: Dispatch<SetStateAction<ACLObj | undefined>>
}

export const AccessControlContext = createContext<AccessControlType>({ aclAbilities: undefined, setAclAbilities: () => { } });

const AclGuard = (props: AclGuardProps) => {
    // ** Props
    const { children, guestGuard = false, authGuard = true } = props

    // ** Hooks
    const auth = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const systemMode = getSystemMode()
    const [aclAbilities, setAclAbilities] = useState<ACLObj>()
    // ** Vars
    let ability: AppAbility

    useEffect(() => {
        if (auth.user && auth?.user?.role === 'Admin' && !guestGuard && pathname === '/') {
            const homeRoute = '/admin'
            router.replace(homeRoute)
        }
    }, [auth.user, guestGuard, router])

    // User is logged in, build ability for the user based on his role
    if (auth.user && !ability) {
        ability = buildAbilityFor(auth?.user?.role ?? 'Guest')
        if (pathname === '/') {
            return <Spinner />
        }
    }

    // If guest guard or no guard is true or any error page
    if (guestGuard || pathname === '/404' || pathname === '/500' || !authGuard) {
        // If user is logged in and his ability is built
        if (auth.user && ability) {
            return (
                <AccessControlContext.Provider value={{ aclAbilities, setAclAbilities }}>
                    <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
                </AccessControlContext.Provider>
            )
        } else {
            // If user is not logged in (render pages like login, register etc..)
            return <>{children}</>
        }
    }

    // Check the access of current user and render pages
    if (ability && auth.user && ability.can(aclAbilities?.action!, aclAbilities?.subject!)) {
        if (pathname === '/') {
            return <Spinner />
        }

        return (
            <AccessControlContext.Provider value={{ aclAbilities, setAclAbilities }}>
                <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
            </AccessControlContext.Provider>
        )
    }

    // Render Not Authorized component if the current user has limited access
    return (
        <>
            <BlankLayout systemMode={systemMode}>
                <Forbidden mode={systemMode} />
            </BlankLayout>

        </>
    )
}

export default AclGuard
