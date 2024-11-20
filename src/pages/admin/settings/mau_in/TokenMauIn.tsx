import { Dialog, DialogContent, DialogTitle, Grid, Stack, Typography, Button } from '@mui/material';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function TokenMauIn({ isShow, onClose }: any) {
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const CopyThisText = (elm: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        const token = elm.currentTarget.innerHTML;
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
            <Dialog open={isShow} maxWidth="xl" onClose={onClose} fullWidth>
                <DialogTitle className="modal-title">
                    Danh sách token mẫu in
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
                        <Grid item xs={12} sm={6} md={4}>
                            <Stack spacing={1}>
                                <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                    <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                        Thông tin cửa hàng, chi nhánh
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}>&#123;Logo&#125;</label>
                                        <Typography variant="subtitle2"> Logo cửa hàng </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TenCuaHang&#125; </label>
                                        <Typography variant="subtitle2"> Tên cửa hàng </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DiaChiCuaHang&#125; </label>
                                        <Typography variant="subtitle2">Địa chỉ cửa hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DienThoaiCuaHang&#125; </label>
                                        <Typography variant="subtitle2">Số điện thoại cửa hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TenChiNhanh&#125; </label>
                                        <Typography variant="subtitle2">Chi nhánh bán hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DienThoaiChiNhanh&#125; </label>
                                        <Typography variant="subtitle2">Điện thoại chi nhánh</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DiaChiChiNhanh&#125; </label>
                                        <Typography variant="subtitle2">Địa chỉ chi nhánh</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack spacing={1}>
                                <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                    <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                        Thông tin khách hàng
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;MaKhachHang&#125; </label>
                                        <Typography variant="subtitle2">Mã khách hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TenKhachHang&#125; </label>
                                        <Typography variant="subtitle2">Tên khách hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DienThoaiKhachHang&#125; </label>
                                        <Typography variant="subtitle2">SĐT khách hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DiaChiKhachHang&#125; </label>
                                        <Typography variant="subtitle2">Địa chỉ khách hàng</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack spacing={1}>
                                <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                    <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                        Thông tin phiếu thu (chi)
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;MaHoaDon&#125; </label>
                                        <Typography variant="subtitle2">Mã phiếu thu (chi)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NgayLapHoaDon&#125; </label>
                                        <Typography variant="subtitle2">Ngày lập phiếu</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NguoiNopTien&#125; </label>
                                        <Typography variant="subtitle2">Người nộp tiền</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;SDTNguoiNop&#125; </label>
                                        <Typography variant="subtitle2">SĐT người nộp</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;HoaDonLienQuan&#125; </label>
                                        <Typography variant="subtitle2">Mã hóa đơn liên quan</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongTienThu&#125; </label>
                                        <Typography variant="subtitle2">Tổng tiền thu (chi)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TienBangChu&#125; </label>
                                        <Typography variant="subtitle2">Tổng tiền thu (chi) (bằng chữ)</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Stack spacing={1}>
                                <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                    <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                        Thông tin hóa đơn
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;MaHoaDon&#125; </label>
                                        <Typography variant="subtitle2">Mã hóa đơn bán hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NgayLapHoaDon&#125; </label>
                                        <Typography variant="subtitle2">Ngày lập hóa đơn</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NgayBan&#125; </label>
                                        <Typography variant="subtitle2">Ngày tạo hóa đơn</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NhanVienBanHang&#125; </label>
                                        <Typography variant="subtitle2">Nhân viên bán hàng</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}>
                                            {' '}
                                            &#123;TongTienHangChuaChietKhau&#125;{' '}
                                        </label>
                                        <Typography variant="subtitle2">
                                            Tổng tiền hàng (chưa trừ chiết khấu)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}>
                                            {' '}
                                            &#123;TongChietKhauHangHoa&#125;{' '}
                                        </label>
                                        <Typography variant="subtitle2">Tổng chiết khấu hàng hóa</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongTienHang&#125; </label>
                                        <Typography variant="subtitle2">Tổng tiền hàng (sau chiết khấu)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;PTThueHD&#125; </label>
                                        <Typography variant="subtitle2">Thuế hóa đơn (%)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongTienThue&#125; </label>
                                        <Typography variant="subtitle2">Thuế hóa đơn (vnd)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongTienHDSauVAT&#125; </label>
                                        <Typography variant="subtitle2">Tổng tiền hóa đơn (sau VAT)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;PTGiamGiaHD&#125; </label>
                                        <Typography variant="subtitle2">Giảm giá hóa đơn (%)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongGiamGiaHD&#125; </label>
                                        <Typography variant="subtitle2">Giảm giá hóa đơn (vnd)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongThanhToan&#125; </label>
                                        <Typography variant="subtitle2">
                                            Tổng tiền hóa đơn (sau VAT, sau giảm giá)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;GhiChuHD&#125; </label>
                                        <Typography variant="subtitle2">Ghi chú hóa đơn</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NoHoaDon&#125; </label>
                                        <Typography variant="subtitle2">Tiền khách nợ của hóa đơn hiện tại</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NoHoaDon_BangChu&#125; </label>
                                        <Typography variant="subtitle2">
                                            Tiền khách nợ của hóa đơn hiện tại (bằng chữ)
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Stack spacing={1}>
                                <Stack sx={{ bgcolor: '#cccc' }} padding={1}>
                                    <Typography variant="subtitle1" color={'blue'} fontWeight={700}>
                                        Thông tin chi tiết hóa đơn
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;STT&#125; </label>
                                        <Typography variant="subtitle2">Số thứ tự</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;MaHangHoa&#125; </label>
                                        <Typography variant="subtitle2">Mã dịch vụ</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TenHangHoa&#125; </label>
                                        <Typography variant="subtitle2">Tên dịch vụ</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TenNhomHangHoa&#125; </label>
                                        <Typography variant="subtitle2">Tên nhóm dịch vụ</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;MoTaHangHoa&#125; </label>
                                        <Typography variant="subtitle2">Mô tả dịch vụ</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;GhiChu&#125; </label>
                                        <Typography variant="subtitle2">Ghi chú chi tiết hóa đơn</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;SoLuong&#125; </label>
                                        <Typography variant="subtitle2">Số lượng mỗi dịch vụ</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DonGiaTruocCK&#125; </label>
                                        <Typography variant="subtitle2">
                                            Giá bán mỗi dịch vụ (trước chiết khấu)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;ThanhTienTruocCK&#125; </label>
                                        <Typography variant="subtitle2">
                                            Thành tiền mỗi dịch vụ (trước chiết khấu)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;PTChietKhau&#125; </label>
                                        <Typography variant="subtitle2">Chiết khấu dịch vụ (%)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TienChietKhau&#125; </label>
                                        <Typography variant="subtitle2">
                                            Chiết khấu dịch vụ (vnd)/1 đơn vị số lượng
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TongChietKhau&#125; </label>
                                        <Typography variant="subtitle2">Tổng chiết khấu của dịch vụ (vnd)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DonGiaSauCK&#125; </label>
                                        <Typography variant="subtitle2">
                                            Giá bán mỗi dịch vụ (sau chiết khấu)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;ThanhTienSauCK&#125; </label>
                                        <Typography variant="subtitle2">
                                            Thành tiền mỗi dịch vụ (sau chiết khấu)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;PTThue&#125; </label>
                                        <Typography variant="subtitle2">Thuế mỗi dịch vụ (%)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;TienThue&#125; </label>
                                        <Typography variant="subtitle2">Thuế mỗi dịch vụ (vnd)</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;DonGiaSauVAT&#125; </label>
                                        <Typography variant="subtitle2">
                                            Giá bán mỗi dịch vụ (sau VAT, sau CK)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;ThanhTienSauVAT&#125; </label>
                                        <Typography variant="subtitle2">
                                            Thành tiền mỗi dịch vụ (sau VAT, sau CK)
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NVTH_TenNhanVien&#125; </label>
                                        <Typography variant="subtitle2">Tên nhân viên thực hiện dịch vụ</Typography>
                                    </Stack>
                                </Stack>
                                <Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <label onClick={(e) => CopyThisText(e)}> &#123;NVTH_GiaTriHoaHong&#125; </label>
                                        <Typography variant="subtitle2">
                                            Giá trị hoa hồng mà NV thực hiện được hưởng
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
