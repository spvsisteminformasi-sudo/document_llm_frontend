
export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  code?: string
  login?: string
  email?: string
  password?: string
  rememberMe?: boolean
  recaptcha?: string
}

export interface RegisterParams {
  name: string
  email: string
  username: string
  password: string
  password_confirmation: string
  phone: string
}

export type UserDataType = {
  id: number
  fullName?: string | null
  password?: string | null
  name?: string
  email?: string
  username?: string
  status?: number
  roles?: RoleType[]
  role?: string
  phone?: string | null
  avatar?: string | null
}

export type RoleType = {
  ADMIN: "Admin"
  GUEST: "Guest"
  USER: "User"
  [key: string]: string
}

export interface AuthValuesType {
  loading: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setLoading: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  logout: () => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
