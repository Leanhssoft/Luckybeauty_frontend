import * as React from 'react';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SnackbarAlert({ handleClose, showAlert, type = 1, title = '' }: any) {
    return (
        <Stack spacing={2} sx={{ zIndex: 10000 }}>
            <Snackbar
                open={showAlert}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={type == 1 ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {title}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
