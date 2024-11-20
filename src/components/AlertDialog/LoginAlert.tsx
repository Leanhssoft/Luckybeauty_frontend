import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const LoginAlertDialog = ({ open, confirmLogin }: any) => {
    return (
        <div>
            <Dialog open={open} keepMounted onClose={confirmLogin} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>{'Phiên làm việc đã hết hiệu lực'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Phiên làm việc đã hết hiệu lực vui lòng đăng nhập lại
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmLogin}>Agree</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default LoginAlertDialog;
