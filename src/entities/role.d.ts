

export interface PermissionType {
    id?: number
    name?: string
    guard_name?: string
}

export interface RoleType {
    id?: number
    name?: string
    permissions?: PermissionType[]
    created_at?: string
    created_by?: string
    updated_at?: string
    updated_by?: string
}
