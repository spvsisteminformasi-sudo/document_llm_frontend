import type { RoleType } from './role'

export interface UserType {
  id?: number
  name?: string
  email?: string
  roles?: RoleType[]
  role?: string
  username?: string
  password?: string
  password_confirmation?: string
  phone?: string
  created_at?: string
  created_by?: string
  updated_at?: string
  updated_by?: string
}
