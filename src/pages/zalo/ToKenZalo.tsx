import { Dialog, DialogContent, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { ISelect } from '../../lib/appconst';

export const ListZaloToken_CuaHang: ISelect[] = [
    { value: '{TenCuaHang}', text: 'Tên cửa hàng' },
    { value: '{DiaChiCuaHang}', text: 'Địa chỉ cửa hàng' },
    { value: '{DienThoaiCuaHang}', text: 'Số điện thoại cửa hàng' },
    { value: '{TenChiNhanh}', text: 'Chi nhánh bán hàng' },
    { value: '{DienThoaiChiNhanh}', text: 'Địa chỉ chi nhánh' },
    { value: '{DiaChiChiNhanh}', text: 'Điện thoại chi nhánh' }
];
export const ListZaloToken_KhachHang: ISelect[] = [
    { value: '{MaKhachHang}', text: 'Mã khách hàng' },
    { value: '{TenKhachHang}', text: 'Tên khách hàng' },
    { value: '{SoDienThoai}', text: 'Số điện thoại khách hàng' },
    { value: '{XungHo}', text: 'Xưng hô' }
];

export const ListZaloToken_HoaDon: ISelect[] = [
    { value: '{MaHoaDon}', text: 'Mã hóa đơn' },
    { value: '{NgayLapHoaDon}', text: 'Ngày hóa đơn' },
    { value: '{TongTienHang}', text: 'Tổng tiền hàng' },
    { value: '{DaThanhToan}', text: 'Giá trị tiền khách thanh toán' },
    { value: '{PTThanhToan}', text: 'Phương thức thanh toán' }
];
export const ListZaloToken_LichHen: ISelect[] = [
    { value: '{BookingCode}', text: 'Mã đặt hẹn' },
    { value: '{BookingDate}', text: 'Ngày đặt lịch hẹn' },
    { value: '{TenDichVu}', text: 'Tên dịch vụ đặt hẹn' }
];

export default function TokenZalo({ isShow, onClose }: any) {
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const CopyThisText = (elm: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        const token = elm.currentTarget.innerText;
        navigator.clipboard.writeText(token);
        setObjAlert({ ...objAlert, show: true, mes: `Đã sao chép trường ${token}` });
    };
    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShow} maxWidth="md" onClose={onClose} fullWidth>
                <DialogTitle className="modal-title">
                    Danh sách token zalo
                    <Stack
                        onClick={onClose}
                        sx={{
                            minWidth: 'unset',
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                            }
                        }}>
                        <CloseOutlinedIcon sx={{ width: 30, height: 30 }} />
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Grid container className="token-mau-in" spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Stack spacing={1}>
                                <Stack spacing={1}>
                                    <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                        <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                            Thông tin cửa hàng, chi nhánh
                                        </Typography>
                                    </Stack>
                                    {ListZaloToken_CuaHang?.map((x) => (
                                        <Stack key={x.value}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <label onClick={(e) => CopyThisText(e)}>{x.value}</label>
                                                <Typography variant="subtitle2"> {x.text} </Typography>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                                <Stack spacing={1}>
                                    <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                        <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                            Thông tin khách hàng
                                        </Typography>
                                    </Stack>
                                    {ListZaloToken_KhachHang?.map((x) => (
                                        <Stack key={x.value}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <label onClick={(e) => CopyThisText(e)}>{x.value}</label>
                                                <Typography variant="subtitle2"> {x.text} </Typography>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Stack spacing={1}>
                                <Stack spacing={1}>
                                    <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                        <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                            Thông tin lịch hẹn
                                        </Typography>
                                    </Stack>
                                    {ListZaloToken_LichHen?.map((x) => (
                                        <Stack key={x.value}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <label onClick={(e) => CopyThisText(e)}>{x.value}</label>
                                                <Typography variant="subtitle2"> {x.text} </Typography>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                                <Stack spacing={1}>
                                    <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                        <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                            Thông tin hóa đơn, dịch vụ
                                        </Typography>
                                    </Stack>
                                    {ListZaloToken_HoaDon?.map((x) => (
                                        <Stack key={x.value}>
                                            <Stack direction={'row'} justifyContent={'space-between'}>
                                                <label onClick={(e) => CopyThisText(e)}>{x.value}</label>
                                                <Typography variant="subtitle2"> {x.text} </Typography>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
