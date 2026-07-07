
export interface DialogConfirmType {
    title: string
    open: boolean
    body: string
    fullWidth?: boolean
    onSubmit: () => void
    onCancel: () => void
}
