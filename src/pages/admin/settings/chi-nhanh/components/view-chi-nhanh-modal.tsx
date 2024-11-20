import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
    FormControl,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { ReactComponent as CloseIcon } from '../../../../../images/close-square.svg';
import { CreateOrEditChiNhanhDto } from '../../../../../services/chi_nhanh/Dto/createOrEditChiNhanhDto';
interface ChiNhanhProps {
    isShow: boolean;
    onCLose: () => void;
    formRef: CreateOrEditChiNhanhDto;
}
class ViewChiNhanhModal extends Component<ChiNhanhProps> {
    render(): ReactNode {
        const { formRef, onCLose, isShow } = this.props;
        return (
            <Dialog open={isShow} onClose={onCLose} fullWidth maxWidth={'md'}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Thông tin chi nhánh
                    <IconButton
                        aria-label="close"
                        onClick={onCLose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            '&:hover svg': {
                                filter: ' brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={<Typography variant="subtitle2">Mã chi nhánh</Typography>}
                                size="small"
                                value={formRef?.maChiNhanh}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={<Typography variant="subtitle2">Tên chi nhánh</Typography>}
                                size="small"
                                value={formRef?.tenChiNhanh}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={<Typography variant="subtitle2">Số điện thoại</Typography>}
                                size="small"
                                value={formRef?.soDienThoai}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={<Typography variant="subtitle2">Địa chỉ</Typography>}
                                size="small"
                                value={formRef?.diaChi}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={<Typography variant="subtitle2">Ngày áp dụng</Typography>}
                                type="date"
                                name="ngayApDung"
                                value={formRef?.ngayApDung.toString().substring(0, 10)}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={<Typography variant="subtitle2">Ngày hết hạn</Typography>}
                                size="small"
                                value={formRef?.ngayHetHan.toString().substring(0, 10)}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    label="Trạng thái"
                                    value={formRef?.trangThai === 1 ? true : false}
                                    checked={formRef?.trangThai === 1 ? true : false}
                                    control={<Checkbox />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={<Typography variant="subtitle2">Ghi chú</Typography>}
                                size="small"
                                rows={4}
                                multiline
                                value={formRef?.ghiChu}
                                fullWidth
                                sx={{ fontSize: '16px', color: '#4c4b4c' }}></TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}
export default ViewChiNhanhModal;
