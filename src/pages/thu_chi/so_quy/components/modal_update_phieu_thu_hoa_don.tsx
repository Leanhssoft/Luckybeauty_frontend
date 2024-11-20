import { Button, Dialog, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { NumericFormat } from 'react-number-format';
import AutocompleteAccountBank from '../../../../components/Autocomplete/AccountBank';
import { FC, useEffect, useState } from 'react';
import { TaiKhoanNganHangDto } from '../../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import TaiKhoanNganHangServices from '../../../../services/so_quy/TaiKhoanNganHangServices';
import utils from '../../../../utils/utils';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import HoaDonService from '../../../../services/ban_hang/HoaDonService';
import { HINH_THUC_THANH_TOAN, LoaiChungTu, TrangThaiActive, TypeAction } from '../../../../lib/appconst';
import { IQuyHoaDonDto } from '../../../../services/so_quy/Dto/IQuyHoaDon_QuyChiTietDto';
import DatePickerCustom from '../../../../components/DatetimePicker/DatePickerCustom';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import Cookies from 'js-cookie';
import { PropConfirmOKCancel } from '../../../../utils/PropParentToChild';
import ConfirmDelete from '../../../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../../../components/abp-custom';

const ModalUpdatePhieuThuHoaDon: FC<{
    isShowModal: boolean;
    idQuyHD: string;
    idHoaDonLienQuan: string;
    onClose: () => void;
    onSaveOK: (typeAction: number, quyHD: QuyHoaDonDto) => void;
}> = ({ isShowModal, idQuyHD, idHoaDonLienQuan, onClose, onSaveOK }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [objQuyHD, setObjQuyHD] = useState<IQuyHoaDonDto>({} as IQuyHoaDonDto);
    const [quyHDOld, setQuyHDOld] = useState<QuyHoaDonDto>({} as QuyHoaDonDto);
    const [allBankAccount, setAllBankAccount] = useState<TaiKhoanNganHangDto[]>([]);
    const [tienMat, setTienMat] = useState(0);
    const [tienChuyenKhoan, setTienChuyenKhoan] = useState(0);
    const [tienQuyeThePos, setTienQuyeThePos] = useState(0);
    const [idTaiKhoanChuyenKhoan, setIdTaiKhoanChuyenKhoan] = useState<string | null>('');
    const [idTaiKhoanPOS, setIdTaiKhoanPOS] = useState<string | null>('');
    const [inforHD, setInforHD] = useState({
        idKhachHang: '',
        maHoaDon: '',
        maKhachHang: '',
        tenKhachHang: '',
        conNo: 0
    });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1, // 1.remove customer, 2.change tabhoadon
        mes: ''
    });

    const sLoaiChungTu = objQuyHD?.idLoaiChungTu === LoaiChungTu.PHIEU_THU ? 'Phiếu thu' : 'Phiếu chi';

    const GetAllTaiKhoanNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount();
        setAllBankAccount(data);
    };

    const GetInforQuyHD_byId = async () => {
        const data = await SoQuyServices.GetInforQuyHoaDon_byId(idQuyHD ?? '');
        console.log('idQuyHD ', idQuyHD, data);

        if (data !== null) {
            const quyCT = data.quyHoaDon_ChiTiet;
            if (quyCT !== undefined && quyCT?.length > 0) {
                let tienMat = 0,
                    tienCK = 0,
                    tienPos = 0;
                let idTaiKhoanPos = null,
                    idTaiKhoanChuyenKhoan = null;
                for (let index = 0; index < quyCT?.length; index++) {
                    const element = quyCT[index];
                    switch (element.hinhThucThanhToan) {
                        case HINH_THUC_THANH_TOAN.TIEN_MAT:
                            {
                                tienMat += element?.tienThu ?? 0;
                            }
                            break;
                        case HINH_THUC_THANH_TOAN.CHUYEN_KHOAN:
                            {
                                tienCK += element?.tienThu ?? 0;
                                idTaiKhoanChuyenKhoan = element?.idTaiKhoanNganHang ?? null;
                            }
                            break;
                        case HINH_THUC_THANH_TOAN.QUYET_THE:
                            {
                                tienPos += element?.tienThu ?? 0;
                                idTaiKhoanPos = element?.idTaiKhoanNganHang ?? null;
                            }
                            break;
                    }
                }
                setTienMat(tienMat);
                setTienChuyenKhoan(tienCK);
                setTienQuyeThePos(tienPos);
                setIdTaiKhoanChuyenKhoan(idTaiKhoanChuyenKhoan == null ? '' : idTaiKhoanChuyenKhoan);
                setIdTaiKhoanPOS(idTaiKhoanPos == null ? '' : idTaiKhoanPos);

                setQuyHDOld({
                    ...quyHDOld,
                    maHoaDon: data?.maHoaDon ?? '',
                    ngayLapHoaDon: data?.ngayLapHoaDon ?? '',
                    tongTienThu: data?.tongTienThu ?? 0,
                    idLoaiChungTu: data?.idLoaiChungTu ?? LoaiChungTu.PHIEU_THU,
                    noiDungThu: data?.noiDungThu ?? '',
                    hachToanKinhDoanh: data?.hachToanKinhDoanh ?? true,
                    trangThai: data?.trangThai ?? TrangThaiActive.ACTIVE,
                    tienMat: tienMat,
                    tienChuyenKhoan: tienCK,
                    tienQuyetThe: tienPos
                });
            }
            setObjQuyHD({
                ...objQuyHD,
                maHoaDon: data?.maHoaDon ?? '',
                ngayLapHoaDon: data?.ngayLapHoaDon ?? '',
                tongTienThu: data?.tongTienThu ?? 0,
                idLoaiChungTu: data?.idLoaiChungTu ?? LoaiChungTu.PHIEU_THU,
                noiDungThu: data?.noiDungThu ?? '',
                hachToanKinhDoanh: data?.hachToanKinhDoanh ?? true,
                trangThai: data?.trangThai ?? TrangThaiActive.ACTIVE
            });
        }
    };

    const GetInforHD_byId = async () => {
        const dataHoaDon = await HoaDonService.GetInforHoaDon_byId(idHoaDonLienQuan ?? '');
        if (dataHoaDon?.length > 0) {
            setInforHD({
                ...inforHD,
                idKhachHang: dataHoaDon[0]?.idKhachHang ?? '',
                maHoaDon: dataHoaDon[0]?.maHoaDon,
                maKhachHang: dataHoaDon[0]?.maKhachHang,
                tenKhachHang: dataHoaDon[0]?.tenKhachHang,
                conNo: dataHoaDon[0]?.conNo ?? 0
            });
        }
    };

    useEffect(() => {
        GetAllTaiKhoanNganHang();
    }, []);

    useEffect(() => {
        if (isShowModal) {
            GetInforQuyHD_byId();
            GetInforHD_byId();
        }
    }, [isShowModal]);

    const tienKhachDua = tienMat + tienChuyenKhoan + tienQuyeThePos;
    const tienKhachThieu = (inforHD?.conNo ?? 0) + objQuyHD.tongTienThu - tienKhachDua;

    const changeTaiKhoanChuyenKhoan = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanChuyenKhoan(item?.id);

        if (utils.checkNull_OrEmpty(item?.id)) {
            setTienChuyenKhoan(0);
        }
    };
    const changeTaiKhoanPOS = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanPOS(item?.id);

        if (utils.checkNull_OrEmpty(item?.id)) {
            setTienQuyeThePos(0);
        }
    };

    const saveSoQuy = async () => {
        const data = await SoQuyServices.savePhieuThu_forHoaDon({
            idQuyHD: idQuyHD,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            maPhieuThu: objQuyHD?.maHoaDon ?? '',
            phaiTT: inforHD.conNo + objQuyHD.tongTienThu,
            tienmat: tienMat,
            tienCK: tienChuyenKhoan,
            tienPOS: tienQuyeThePos,
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            noiDungThu: objQuyHD?.noiDungThu ?? '',
            idTaiKhoanChuyenKhoan: idTaiKhoanChuyenKhoan as null,
            idTaiKhoanPOS: idTaiKhoanPOS as null,
            ngayLapHoaDon: objQuyHD.ngayLapHoaDon,
            hoadon: {
                id: idHoaDonLienQuan as unknown as null,
                idKhachHang: (inforHD?.idKhachHang ?? '') as unknown as null,
                tenKhachHang: inforHD?.tenKhachHang ?? '',
                maHoaDon: inforHD?.maHoaDon ?? ''
            }
        });
        if (data) {
            onSaveOK(TypeAction.UPDATE, data);
        }
    };

    const onDeleteQuyHD = async () => {
        setConfirmDialog({ ...confirmDialog, show: false });
        const data = await SoQuyServices.DeleteSoQuy(idQuyHD);
        onSaveOK(TypeAction.DELETE, data);
    };

    return (
        <>
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onDeleteQuyHD}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}></ConfirmDelete>
            <Dialog open={isShowModal} maxWidth="md" fullWidth onClose={onClose}>
                <Grid
                    container
                    padding={2}
                    sx={{
                        boxShadow: '1px 5px 10px 4px #00000026',
                        borderRadius: '12px',
                        bgcolor: '#fff'
                    }}>
                    <Grid item xs={12} position={'relative'}>
                        <Typography fontSize="24px" fontWeight="700">
                            Cập nhật phiếu thu
                        </Typography>
                        <CloseOutlinedIcon
                            sx={{ position: 'absolute', right: 0, top: 0, width: 36, height: 36 }}
                            onClick={onClose}
                        />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <Grid container padding={2} paddingLeft={0}>
                            <Grid item xs={6} lg={7} md={7} sm={6}>
                                <Typography fontSize={20} fontWeight={500}>
                                    Tổng tiền thu
                                </Typography>
                            </Grid>
                            <Grid item xs={6} lg={5} md={5} sm={6}>
                                <Typography textAlign={'right'} fontSize={20} fontWeight={500}>
                                    {new Intl.NumberFormat('vi-VN').format(objQuyHD.tongTienThu)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        padding={2}
                        sx={{ backgroundColor: 'var(--color-bg)', borderRadius: '8px', paddingTop: '16px' }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                <Stack spacing={2}>
                                    <Stack direction={'row'}>
                                        <Typography flex={1}>Mã phiếu thu</Typography>
                                        <TextField
                                            sx={{
                                                flex: 2,
                                                '& input': {
                                                    fontWeight: 700
                                                }
                                            }}
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            value={objQuyHD?.maHoaDon ?? ''}
                                            onChange={(e) => setObjQuyHD({ ...objQuyHD, maHoaDon: e.target.value })}
                                        />
                                    </Stack>
                                    <Stack direction={'row'}>
                                        <Typography flex={1}>Ngày lập</Typography>
                                        <Stack sx={{ flex: 2 }}>
                                            <DatePickerCustom
                                                variant="standard"
                                                defaultVal={objQuyHD.ngayLapHoaDon}
                                                handleChangeDate={(dt) =>
                                                    setObjQuyHD({ ...objQuyHD, ngayLapHoaDon: dt })
                                                }
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} lg={6} md={6} sm={6}>
                                <Stack spacing={2}>
                                    <Stack direction={'row'}>
                                        <Typography flex={1}>Mã hóa đơn</Typography>
                                        <TextField
                                            sx={{
                                                flex: 2,
                                                '& input': {
                                                    fontWeight: 700
                                                }
                                            }}
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                            disabled
                                            value={inforHD?.maHoaDon ?? ''}
                                        />
                                    </Stack>
                                    <Stack direction={'row'}>
                                        <Typography flex={1}>Khách hàng</Typography>
                                        <TextField
                                            sx={{
                                                flex: 2,
                                                '& input': {
                                                    fontWeight: 700
                                                }
                                            }}
                                            variant="standard"
                                            fullWidth
                                            disabled
                                            size="small"
                                            value={inforHD?.tenKhachHang ?? ''}
                                        />
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    variant="standard"
                                    fullWidth
                                    placeholder="Nội dung thu"
                                    value={objQuyHD.noiDungThu}
                                    onChange={(e) => setObjQuyHD({ ...objQuyHD, noiDungThu: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CreateOutlinedIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        marginTop={2}
                        padding={2}
                        sx={{ backgroundColor: 'rgb(245 241 241)', borderRadius: '8px', paddingTop: '16px' }}
                        className="payment-form-hinhthucTT">
                        <Grid container display={'none'}>
                            <Grid item lg={2} md={3}>
                                <Typography>Sử dụng điểm</Typography>
                            </Grid>
                            <Grid item lg={10} md={8}>
                                <Grid container spacing={2}>
                                    <Grid item lg={7}>
                                        <Typography
                                            sx={{
                                                fontSize: '14px!important',
                                                fontWeight: '400!important'
                                            }}>
                                            Tổng điểm: 333
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={5}>
                                        <Stack spacing={2} direction={'row'}>
                                            <TextField size="small" />
                                            <TextField size="small" />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ display: 'none' }}>
                            <Grid item lg={2} md={3}>
                                <Typography>Thu từ thẻ</Typography>
                            </Grid>
                            <Grid item lg={10} md={9}>
                                <Grid container spacing={2}>
                                    <Grid item lg={7}>
                                        <Typography
                                            sx={{
                                                fontSize: '14px!important',
                                                fontWeight: '400!important'
                                            }}>
                                            Số dư: 12.0000
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={5}>
                                        <TextField size="small" fullWidth />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={'space-between'}>
                            <Grid item lg={3} md={3} sm={3} xs={6}>
                                <Typography>Tiền mặt</Typography>
                            </Grid>
                            <Grid item lg={9} md={9} sm={9} xs={6}>
                                <Grid container spacing={2}>
                                    <Grid item lg={9} md={8} sm={9}></Grid>
                                    <Grid item lg={3} md={4} sm={3}>
                                        <NumericFormat
                                            className="input-number"
                                            size="small"
                                            fullWidth
                                            value={tienMat}
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            customInput={TextField}
                                            onChange={(event) => {
                                                setTienMat(utils.formatNumberToFloat(event.target.value));
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent={'space-between'} paddingTop={1}>
                            <Grid item lg={3} md={3} xs={12} sm={3}>
                                <Typography>Chuyển khoản</Typography>
                            </Grid>
                            <Grid item lg={9} md={9} xs={12} sm={9} paddingTop={{ xs: 1, lg: 0, md: 0, sm: 0 }}>
                                <Grid container spacing={2}>
                                    <Grid item lg={9} md={8} sm={9} xs={9}>
                                        <AutocompleteAccountBank
                                            handleChoseItem={changeTaiKhoanChuyenKhoan}
                                            idChosed={idTaiKhoanChuyenKhoan}
                                            listOption={allBankAccount}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={3} xs={3}>
                                        <NumericFormat
                                            size="small"
                                            fullWidth
                                            disabled={utils.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)}
                                            value={tienChuyenKhoan}
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            className="input-number"
                                            customInput={TextField}
                                            onChange={(event) => {
                                                setTienChuyenKhoan(utils.formatNumberToFloat(event.target.value));
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent={'space-between'} paddingTop={1}>
                            <Grid item lg={3} md={3} xs={12} sm={3}>
                                <Typography>Quyẹt thẻ</Typography>
                            </Grid>
                            <Grid item lg={9} md={9} xs={12} sm={9} paddingTop={{ xs: 1, lg: 0, md: 0, sm: 0 }}>
                                <Grid container spacing={2}>
                                    <Grid item lg={9} md={8} sm={9} xs={9}>
                                        <AutocompleteAccountBank
                                            handleChoseItem={changeTaiKhoanPOS}
                                            idChosed={idTaiKhoanPOS}
                                            listOption={allBankAccount}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={3} xs={3}>
                                        <NumericFormat
                                            size="small"
                                            fullWidth
                                            disabled={utils.checkNull_OrEmpty(idTaiKhoanPOS)}
                                            value={tienQuyeThePos}
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            className="input-number"
                                            customInput={TextField}
                                            onChange={(event) => {
                                                setTienQuyeThePos(utils.formatNumberToFloat(event.target.value));
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent={'space-between'} padding={2}>
                            <Grid item lg={3} md={3} sm={3} xs={0}></Grid>
                            <Grid item lg={9} md={9} sm={9} xs={12}>
                                <Grid container>
                                    <Grid item lg={9} md={8} sm={9} xs={9}>
                                        <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                            Tổng khách trả
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={3} xs={3}>
                                        <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                            {new Intl.NumberFormat('vi-VN').format(tienKhachDua)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={'space-between'} paddingRight={2}>
                            <Grid item lg={3} md={3} sm={3} xs={0}></Grid>
                            <Grid item lg={9} md={9} sm={9} xs={12}>
                                <Grid container>
                                    <Grid item lg={9} md={8} sm={9} xs={9}>
                                        <Typography textAlign={'right'} fontSize={16} fontWeight={500}>
                                            {tienKhachThieu >= 0 ? 'Tiền thiếu' : 'Tiền thừa'}
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={3} xs={3}>
                                        <Typography textAlign={'right'} fontSize={16} fontWeight={500}>
                                            {new Intl.NumberFormat('vi-VN').format(Math.abs(tienKhachThieu))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} marginTop={3}>
                        <Grid container>
                            <Grid item lg={6} md={6} sm={6} xs={12}></Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'end'}>
                                    {abpCustom.isGrandPermission('Pages.QuyHoaDon.Delete') && (
                                        <Button
                                            size="large"
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() =>
                                                setConfirmDialog({
                                                    ...confirmDialog,
                                                    show: true,
                                                    mes: `Bạn có chắc chắn muốn xóa ${sLoaiChungTu} ${quyHDOld?.maHoaDon} không?`
                                                })
                                            }>
                                            Xóa
                                        </Button>
                                    )}
                                    {abpCustom.isGrandPermission('Pages.QuyHoaDon.Edit') && (
                                        <Button
                                            size="large"
                                            variant="contained"
                                            startIcon={<CheckOutlinedIcon />}
                                            onClick={saveSoQuy}>
                                            Lưu
                                        </Button>
                                    )}

                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<BlockIcon />}
                                        onClick={onClose}>
                                        Đóng
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    );
};
export default ModalUpdatePhieuThuHoaDon;
