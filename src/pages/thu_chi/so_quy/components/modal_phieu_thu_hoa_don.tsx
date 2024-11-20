import {
    Box,
    Radio,
    Button,
    TextField,
    Typography,
    Grid,
    RadioGroup,
    FormControlLabel,
    Input,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { Guid } from 'guid-typescript';
import { format } from 'date-fns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppConsts, {
    HINH_THUC_THANH_TOAN,
    ISelect,
    LoaiChungTu,
    LoaiDoiTuong,
    TrangThaiActive
} from '../../../../lib/appconst';
import utils from '../../../../utils/utils';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import HoaDonService from '../../../../services/ban_hang/HoaDonService';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';
import BankAccount from '../../../../components/Switch/BankAccount';
import suggestStore from '../../../../stores/suggestStore';
import { TaiKhoanNganHangDto } from '../../../../services/so_quy/Dto/TaiKhoanNganHangDto';

const themeDate = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& fieldset': {
                        border: 'none',
                        borderRadius: '0px',
                        borderBottom: '1px solid black'
                    }
                }
            }
        }
    }
});

const ModalPhieuThuHoaDon = ({ isShow, idQuyHD = null, onClose, onOk }: any) => {
    const arrHinhThucThanhToan = [...AppConsts.hinhThucThanhToan, { value: 0, text: 'Kết hợp' }];
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienKhachTraMax, setTienKhachTraMax] = useState(0);
    const [idTaiKhoanNganHang, setIdTaiKhoanNganHang] = React.useState('');

    const [idHinhThucTT, setIdHinhThucTT] = React.useState(HINH_THUC_THANH_TOAN.TIEN_MAT);
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(new PageHoaDonDto({ tenKhachHang: '' }));
    const [quyHDOld, setQuyHDOld] = useState(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: idChiNhanh,
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );

    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: Guid.create().toString(),
            idChiNhanh: idChiNhanh,
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            tongTienThu: 0,
            idDoiTuongNopTien: null,
            hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT,
            hachToanKinhDoanh: true,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetInforQuyHoaDon_byId(idQuyHD ?? '');
        if (data !== null) {
            const quyCT = data.quyHoaDon_ChiTiet;
            if (quyCT !== undefined && quyCT?.length > 0) {
                let nguoiNopTien = 'Khách lẻ',
                    noHD = 0;
                const dataHoaDon = await HoaDonService.GetInforHoaDon_byId(quyCT[0].idHoaDonLienQuan ?? '');
                if (dataHoaDon.length > 0) {
                    setHoaDon(dataHoaDon[0]);
                    nguoiNopTien = dataHoaDon[0].tenKhachHang;
                    noHD = dataHoaDon[0]?.conNo ?? 0;
                }

                setQuyHDOld(data);
                const hinhThucTT = quyCT?.length > 1 ? HINH_THUC_THANH_TOAN.KET_HOP : quyCT[0].hinhThucThanhToan;
                setIdHinhThucTT(hinhThucTT);

                if (quyCT?.length > 1) {
                    const exPOS = quyCT.filter(
                        (x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN
                    );
                    if (exPOS.length === 0) {
                        quyCT.push(
                            new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.CHUYEN_KHOAN, tienThu: 0 })
                        );
                    }
                    const exCK = quyCT.filter(
                        (x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE
                    );
                    if (exCK.length === 0) {
                        quyCT.push(
                            new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.QUYET_THE, tienThu: 0 })
                        );
                    }
                    // nếu thanh toán kết hợp: push hình thức thanh toán còn thiếu (gtrị tienthu = 0)
                    const exMat = quyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 1);
                    if (exMat.length === 0) {
                        // tiemmat: luôn nằm ở vị trí đầu tiên
                        quyCT.unshift(
                            new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT, tienThu: 0 })
                        );
                    }
                }
                let idTaiKhoanNganHang = '';
                const itemPos_Ck = quyCT.filter(
                    (x: QuyChiTietDto) =>
                        x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN ||
                        x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE
                );
                if (itemPos_Ck.length > 0) {
                    idTaiKhoanNganHang = itemPos_Ck[0].idTaiKhoanNganHang as string;
                }
                setIdTaiKhoanNganHang(idTaiKhoanNganHang);

                setQuyHoaDon({
                    ...quyHoaDon,
                    id: data.id,
                    idChiNhanh: data.idChiNhanh,
                    idLoaiChungTu: data.idLoaiChungTu,
                    ngayLapHoaDon: data.ngayLapHoaDon,
                    maHoaDon: data.maHoaDon,
                    noiDungThu: data.noiDungThu,
                    tongTienThu: data.tongTienThu,
                    hachToanKinhDoanh: data.hachToanKinhDoanh,
                    loaiDoiTuong: quyCT[0]?.idNhanVien != null ? LoaiDoiTuong.NHAN_VIEN : LoaiDoiTuong.KHACH_HANG,
                    idDoiTuongNopTien: quyCT[0]?.idNhanVien != null ? quyCT[0]?.idNhanVien : quyCT[0]?.idKhachHang,
                    hinhThucThanhToan: hinhThucTT,
                    idKhoanThuChi: quyCT[0].idKhoanThuChi,
                    idTaiKhoanNganHang: idTaiKhoanNganHang,
                    quyHoaDon_ChiTiet: quyCT,
                    tenNguoiNop: nguoiNopTien,
                    trangThai: data?.trangThai
                });

                setSumTienKhachTra(data.tongTienThu);
                setTienKhachTraMax(data.tongTienThu + noHD);
                setTienThuaTraKhach(0);
            }
        }
    };

    useEffect(() => {
        getInforQuyHoaDon();
    }, [isShow]);

    const onChangeTienKhachTra = (gtri: string, loai: number) => {
        const gtriNhapNew = utils.formatNumberToFloat(gtri);
        if (idHinhThucTT === HINH_THUC_THANH_TOAN.KET_HOP) {
            // tinh lai  tien
            switch (loai) {
                case HINH_THUC_THANH_TOAN.TIEN_MAT: // tinhtien chuyenkhoan
                    {
                        const conLai = tienKhachTraMax - gtriNhapNew;
                        setQuyHoaDon({
                            ...quyHoaDon,
                            quyHoaDon_ChiTiet: quyHoaDon?.quyHoaDon_ChiTiet?.map((item: QuyChiTietDto) => {
                                if (item.hinhThucThanhToan === 1) {
                                    return { ...item, tienThu: gtriNhapNew };
                                } else {
                                    if (item.hinhThucThanhToan === 2) {
                                        return { ...item, tienThu: conLai > 0 ? conLai : 0 };
                                    } else {
                                        return { ...item, tienThu: 0 };
                                    }
                                }
                            })
                        });
                        setTienThuaTraKhach(0);
                        setSumTienKhachTra(tienKhachTraMax);
                    }

                    break;
                case HINH_THUC_THANH_TOAN.CHUYEN_KHOAN: // tinhtien pos
                    {
                        const sumTienMat = quyHoaDon?.quyHoaDon_ChiTiet
                            ?.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 1)
                            .reduce((currentValue: number, item: QuyChiTietDto) => {
                                return item.tienThu + currentValue;
                            }, 0);
                        const conLai = tienKhachTraMax - (sumTienMat ?? 0) - gtriNhapNew;

                        setQuyHoaDon({
                            ...quyHoaDon,
                            quyHoaDon_ChiTiet: quyHoaDon?.quyHoaDon_ChiTiet?.map((item: QuyChiTietDto) => {
                                if (item.hinhThucThanhToan === 1) {
                                    return { ...item };
                                } else {
                                    if (item.hinhThucThanhToan === 2) {
                                        return { ...item, tienThu: gtriNhapNew };
                                    } else {
                                        return { ...item, tienThu: conLai > 0 ? conLai : 0 };
                                    }
                                }
                            })
                        });
                        setTienThuaTraKhach(0);
                        setSumTienKhachTra(tienKhachTraMax);
                    }
                    break;
                case HINH_THUC_THANH_TOAN.QUYET_THE:
                    {
                        const sumMatCK = quyHoaDon?.quyHoaDon_ChiTiet
                            ?.filter((x: QuyChiTietDto) => x.hinhThucThanhToan !== 3)
                            .reduce((currentValue: number, item: QuyChiTietDto) => {
                                return item.tienThu + currentValue;
                            }, 0);
                        const tongTT = (sumMatCK ?? 0) + gtriNhapNew;
                        let tienthua = 0;
                        if (tongTT !== tienKhachTraMax) {
                            tienthua = tongTT - tienKhachTraMax;

                            setQuyHoaDon({
                                ...quyHoaDon,
                                quyHoaDon_ChiTiet: quyHoaDon?.quyHoaDon_ChiTiet?.map((item: QuyChiTietDto) => {
                                    if (item.hinhThucThanhToan !== 3) {
                                        return { ...item };
                                    } else {
                                        return { ...item, tienThu: gtriNhapNew };
                                    }
                                })
                            });
                        }
                        setSumTienKhachTra(tongTT);
                        setTienThuaTraKhach(tienthua);
                    }
                    break;
            }
        } else {
            setQuyHoaDon({
                ...quyHoaDon,
                quyHoaDon_ChiTiet: quyHoaDon?.quyHoaDon_ChiTiet?.map((item: QuyChiTietDto) => {
                    if (item.hinhThucThanhToan === loai) {
                        return { ...item, tienThu: gtriNhapNew };
                    } else {
                        return { ...item };
                    }
                })
            });
            setSumTienKhachTra(gtriNhapNew);
            setTienThuaTraKhach(gtriNhapNew - tienKhachTraMax);
        }
    };

    const choseHinhThucThanhToan = (item: ISelect) => {
        const newHTThanhToan = item.value as unknown as number;
        setIdHinhThucTT(newHTThanhToan);

        if (newHTThanhToan !== HINH_THUC_THANH_TOAN.KET_HOP) {
            setQuyHoaDon({
                ...quyHoaDon,
                quyHoaDon_ChiTiet: [
                    new QuyChiTietDto({
                        tienThu: quyHDOld.tongTienThu,
                        hinhThucThanhToan: newHTThanhToan
                    })
                ]
            });
        } else {
            setQuyHoaDon({
                ...quyHoaDon,
                quyHoaDon_ChiTiet: [
                    new QuyChiTietDto({
                        tienThu: quyHDOld.tongTienThu,
                        hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT
                    }),
                    new QuyChiTietDto({
                        tienThu: 0,
                        hinhThucThanhToan: HINH_THUC_THANH_TOAN.CHUYEN_KHOAN
                    }),
                    new QuyChiTietDto({
                        tienThu: 0,
                        hinhThucThanhToan: HINH_THUC_THANH_TOAN.QUYET_THE
                    })
                ]
            });
        }
    };

    const changeTaiKhoanNganHang = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanNganHang(item?.id);

        setQuyHoaDon({
            ...quyHoaDon,
            quyHoaDon_ChiTiet: quyHoaDon?.quyHoaDon_ChiTiet?.map((itemCT: QuyChiTietDto) => {
                if (
                    itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN ||
                    itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE
                ) {
                    return {
                        ...itemCT,
                        idTaiKhoanNganHang: item?.id,
                        tenNganHang: item?.tenNganHang,
                        tenChuThe: item?.tenChuThe,
                        soTaiKhoan: item?.soTaiKhoan,
                        maPinNganHang: item?.maPinNganHang
                    };
                } else {
                    return { ...itemCT };
                }
            })
        });
    };

    const savePhieuThu = async () => {
        if (quyHoaDon?.quyHoaDon_ChiTiet !== undefined && quyHoaDon?.quyHoaDon_ChiTiet.length > 0) {
            const lstQCT_After = SoQuyServices.AssignAgainQuyChiTiet(
                quyHoaDon?.quyHoaDon_ChiTiet,
                sumTienKhachTra,
                tienKhachTraMax
            );
            const tongThu = lstQCT_After.reduce((currentValue: number, item: any) => {
                return currentValue + item.tienThu;
            }, 0);
            const objQuyHD = { ...quyHoaDon };
            objQuyHD.tongTienThu = tongThu;

            // assign idHoadonLienQuan, idKhachHang for quyCT
            lstQCT_After.map((x: QuyChiTietDto) => {
                x.idHoaDonLienQuan = hoadon?.id;
                x.idKhachHang = hoadon?.idKhachHang == Guid.EMPTY ? null : hoadon?.idKhachHang;
            });
            objQuyHD.quyHoaDon_ChiTiet = lstQCT_After;
            const lstPTTT = lstQCT_After?.map((x: QuyChiTietDto) => {
                return x.hinhThucThanhToan;
            });
            let sPThuc = '';
            for (let i = 0; i < lstPTTT.length; i++) {
                switch (lstPTTT[i]) {
                    case HINH_THUC_THANH_TOAN.TIEN_MAT:
                        sPThuc = 'Tiền mặt, ';
                        break;
                    case HINH_THUC_THANH_TOAN.CHUYEN_KHOAN:
                        sPThuc += 'Chuyển khoản, ';
                        break;
                    case HINH_THUC_THANH_TOAN.QUYET_THE:
                        sPThuc += 'Quẹt thẻ, ';
                        break;
                }
            }

            objQuyHD.sHinhThucThanhToan = utils.Remove_LastComma(sPThuc);
            await SoQuyServices.UpdateQuyHD_RemoveCT_andAddAgain(objQuyHD);
            onOk(objQuyHD, 2);
        }
    };

    return (
        <>
            <Dialog open={isShow} maxWidth="md" onClose={onClose}>
                <DialogTitle>
                    <Typography className="modal-title">Thông tin phiếu thu</Typography>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="16px">
                                Tổng tiền thu
                            </Typography>
                            <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="16px">
                                {new Intl.NumberFormat('vi-VN').format(quyHoaDon?.tongTienThu)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: 'var(--color-bg)',
                                borderRadius: '4px',
                                paddingTop: 2,
                                padding: '16px'
                            }}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} padding={2}>
                                    <Stack spacing={2}>
                                        <Stack spacing={2} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Mã phiếu thu</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <TextField
                                                    fullWidth
                                                    variant="standard"
                                                    size="small"
                                                    value={quyHoaDon.maHoaDon}
                                                    onChange={(event) =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            maHoaDon: event.target.value
                                                        })
                                                    }
                                                />
                                            </Stack>
                                        </Stack>
                                        <Stack spacing={2} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Ngày lập</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <ThemeProvider theme={themeDate}>
                                                    <DateTimePickerCustom
                                                        props={{ width: '100%' }}
                                                        defaultVal={quyHoaDon.ngayLapHoaDon}
                                                        handleChangeDate={(dt: string) => {
                                                            setQuyHoaDon({
                                                                ...quyHoaDon,
                                                                ngayLapHoaDon: dt
                                                            });
                                                        }}
                                                    />
                                                </ThemeProvider>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} padding={2}>
                                    <Stack spacing={2} marginTop={'10px'}>
                                        <Stack spacing={1} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Hóa đơn</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <Typography color="#29303D" fontWeight="600" fontSize="13px">
                                                    {hoadon.maHoaDon}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack spacing={1} direction={'row'} alignItems={'end'}>
                                            <Stack flex={4}>
                                                <Typography variant="body2">Khách hàng</Typography>
                                            </Stack>
                                            <Stack flex={8}>
                                                <Typography color="#29303D" fontWeight="600" fontSize="13px">
                                                    {hoadon.tenKhachHang}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                        <Grid container justifyContent="space-between" alignItems="center" rowGap="16px">
                            <Grid item xs="auto">
                                <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="14px">
                                    Tiền khách trả
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <RadioGroup
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        '& label:last-of-type': {
                                            marginRight: '0'
                                        }
                                    }}>
                                    {arrHinhThucThanhToan.map((item, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Radio
                                                    size="small"
                                                    value={item.value}
                                                    checked={idHinhThucTT === item.value}
                                                    onChange={() => {
                                                        choseHinhThucThanhToan(item);
                                                    }}
                                                />
                                            }
                                            label={item.text}
                                            sx={{
                                                '& .MuiFormControlLabel-label': {
                                                    color: 'rgba(0, 0, 0, 0.85)',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            paddingY: '13.5px',
                                            textAlign: 'right'
                                        }
                                    }}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    customInput={TextField}
                                    value={sumTienKhachTra}
                                    onChange={(event) => onChangeTienKhachTra(event.target.value, idHinhThucTT)}
                                />
                            </Grid>

                            {quyHoaDon?.quyHoaDon_ChiTiet !== undefined && quyHoaDon?.quyHoaDon_ChiTiet?.length > 1 ? (
                                <Grid container spacing="16px">
                                    {quyHoaDon?.quyHoaDon_ChiTiet?.map((item, index) => (
                                        <Grid item xs={4} key={index}>
                                            <Box
                                                sx={{
                                                    border: '1px solid #C2C9D6',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    padding: '8px 16px',
                                                    '& input': {
                                                        border: '0',
                                                        width: '100%',
                                                        textAlign: 'right',
                                                        color: '#525F7A',
                                                        fontSizze: '16px',
                                                        outline: 'none'
                                                    },
                                                    '& input::-webkit-outer-spin-button,& input::-webkit-inner-spin-button':
                                                        {
                                                            WebkitAppearance: 'none',
                                                            margin: '0'
                                                        }
                                                }}>
                                                <Typography variant="body1" color="#525F7A" fontSize="12px">
                                                    {
                                                        arrHinhThucThanhToan.filter(
                                                            (x: ISelect) => x.value === item.hinhThucThanhToan
                                                        )[0].text
                                                    }
                                                </Typography>

                                                <NumericFormat
                                                    size="small"
                                                    fullWidth
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    customInput={Input}
                                                    sx={{
                                                        '&:before': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}
                                                    value={item.tienThu}
                                                    onChange={(event) =>
                                                        onChangeTienKhachTra(event.target.value, item.hinhThucThanhToan)
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : undefined}
                            <Grid item xs={12}>
                                {idHinhThucTT !== HINH_THUC_THANH_TOAN.TIEN_MAT && (
                                    <Stack>
                                        <Stack style={{ marginTop: '16px' }}>
                                            <BankAccount
                                                lstBankAccount={suggestStore?.suggestTaiKhoanNganHangQr}
                                                idChosed={idTaiKhoanNganHang}
                                                handleChoseItem={changeTaiKhoanNganHang}
                                            />
                                        </Stack>
                                    </Stack>
                                )}
                            </Grid>

                            {tienThuaTraKhach !== 0 && (
                                <Grid container justifyContent="space-between">
                                    <Grid item xs="auto">
                                        <Typography variant="body1" color="#3D475C" fontWeight="400" fontSize="14px">
                                            {tienThuaTraKhach > 0 ? 'Tiền thừa' : 'Tiên khách thiếu'}
                                        </Typography>
                                    </Grid>
                                    <Grid xs="auto" item>
                                        <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="14px">
                                            {new Intl.NumberFormat('vi-VN').format(Math.abs(tienThuaTraKhach))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <Box>
                            <Typography variant="body2">Ghi chú</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={quyHoaDon?.noiDungThu}
                                onChange={(e) =>
                                    setQuyHoaDon({ ...quyHoaDon, noiDungThu: e.target.value })
                                }></TextField>
                        </Box>
                        <Stack>
                            {quyHoaDon?.trangThai == TrangThaiActive.ACTIVE ? (
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: '158px',
                                        marginX: 'auto',
                                        mt: 'auto',
                                        mb: '5px',
                                        paddingY: '14px',
                                        fontSize: '16px'
                                    }}
                                    onClick={savePhieuThu}>
                                    Cập nhật
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={onClose}
                                    sx={{
                                        width: '158px',
                                        marginX: 'auto',
                                        mt: 'auto',
                                        mb: '5px',
                                        paddingY: '14px',
                                        fontSize: '16px'
                                    }}>
                                    Đóng
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default ModalPhieuThuHoaDon;
