import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { IPropModal } from '../../services/dto/IPropsComponent';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export default function ThongBaoGiaoDich({ isShowModal, onClose, onOK }: IPropModal<string>) {
    return (
        <>
            <Dialog open={isShowModal} onClose={onClose}>
                <DialogTitle>Giao dịch thành công</DialogTitle>
                <DialogContent>
                    <Stack sx={{ alignItems: 'center', gap: 4 }}>
                        <CheckCircleOutlineOutlinedIcon sx={{ width: 100, height: 100, color: 'green' }} />
                        <Button variant="outlined" onClick={onClose}>
                            Đóng
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}
