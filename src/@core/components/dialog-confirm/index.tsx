// ** React Imports

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { DialogConfirmType } from './index.type'
import { Box, Button, DialogActions, DialogContentText } from '@mui/material'

const DialogConfirm = (props: DialogConfirmType) => {
    const { title, open, body, fullWidth = false, onSubmit, onCancel } = props

    return (
        <Dialog fullWidth={fullWidth} maxWidth="md" scroll="body" open={open}>
            <DialogTitle>
                <Typography variant="h5" component="span">
                    {`${title}`}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{body}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Box className="demo-space-x">
                    <Button
                        size="large"
                        variant="contained"
                        onClick={onSubmit}
                        autoFocus
                    >
                        Submit
                    </Button>
                    <Button
                        size="large"
                        color="secondary"
                        onClick={onCancel}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default DialogConfirm
