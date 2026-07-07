// ** React Imports

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { DialogFormType } from './index.type'
import { Box, Button, DialogActions, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { LoadingButton } from '@mui/lab'

const DialogForm = (props: DialogFormType) => {
    const {
        children,
        title,
        open,
        fullWidth = false,
        loading = false,
        handleSubmit,
        handleClose,
        onSubmit,
        onCancel,
    } = props

    return (
        <Dialog fullWidth={fullWidth} maxWidth={'md'} scroll="body" open={open}>
            <DialogTitle
                sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                }}>
                <Typography variant="h5" component="span">
                    {`${title}`}
                </Typography>

                <IconButton
                    id={'dialog-close'}
                    aria-label="close"
                    onClick={handleClose ?? onCancel}
                    sx={{
                        position: 'absolute',
                        right: 14,
                        top: 12,
                        color: 'grey.500',
                    }}>
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>{children}</DialogContent>

                <DialogActions>
                    <Box className="demo-space-x">
                        <LoadingButton
                            id={'dialog-submit'}
                            size="large"
                            loading={loading}
                            type="submit"
                            variant="contained">
                            Submit
                        </LoadingButton>
                        <Button
                            id={'dialog-cancel'}
                            size="large"
                            variant="outlined"
                            onClick={onCancel}>
                            Cancel
                        </Button>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default DialogForm
