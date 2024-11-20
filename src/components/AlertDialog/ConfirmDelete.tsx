import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const ConfirmDelete = ({ isShow, onOk, onCancel, title = '', mes = '' }: any) => {
    return (
        <Dialog
            open={isShow}
            onClose={onCancel}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    height: 'auto',
                    width: '450px'
                }
            }}>
            <DialogTitle>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography color={'#3D475C'} fontSize={'18px'} fontWeight={700}>
                        {title != '' ? title : 'Thông báo xóa'}
                    </Typography>
                    <CloseOutlinedIcon sx={{ height: '24px' }} onClick={onCancel} />
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column">
                    <Typography color="#679" fontSize={'14px'} fontWeight={400}>
                        {mes != '' ? mes : 'Bạn có chắc chắn muốn xóa bản ghi này không?'}
                    </Typography>
                    <Stack mt={3} direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            sx={{
                                fontSize: '14px',
                                textTransform: 'unset',
                                color: '#666466'
                            }}
                            className="btn-outline-hover">
                            Bỏ qua
                        </Button>
                        <Button
                            sx={{
                                background: '#F1416C',
                                color: '#EEF0F4',
                                '&:hover': {
                                    background: '#FF316A',
                                    color: '#FFF'
                                }
                            }}
                            onClick={onOk}>
                            Đồng ý
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDelete;
