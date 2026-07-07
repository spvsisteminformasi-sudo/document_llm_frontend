import { ReactNode } from 'react'
import { UseFormHandleSubmit } from 'react-hook-form'

export interface DialogFormType {
    children?: ReactNode
    title: string
    open: boolean
    fullWidth?: boolean
    loading?: boolean
    handleSubmit: UseFormHandleSubmit<any>
    handleClose?: () => void
    onSubmit: (data: any) => void
    onCancel: () => void
}
