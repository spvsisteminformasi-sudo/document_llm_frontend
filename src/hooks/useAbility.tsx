import { AccessControlContext } from "@/@core/auth/AclGuard"
import { AbilityContext } from "@/@core/auth/Can"
import { Actions } from "@/configs/acl"
import { useRouter } from "next/navigation"
import { useContext } from "react"


export const useAbility = () => {
    
    const ability = useContext(AbilityContext)
    const acl = useContext(AccessControlContext)
    const router = useRouter()

    const can = (action: string, subject: string) => {
        return ability.can(action, subject)
    }

    const checkPermission = (action: Actions, subject: string) => {
        acl.setAclAbilities({ subject: subject, action: action })
    }
    return {
        can,
        checkPermission
    }
}