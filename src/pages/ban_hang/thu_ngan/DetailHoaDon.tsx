import {
    Box,
    Radio,
    Button,
    TextField,
    Typography,
    IconButton,
    ButtonGroup,
    Grid,
    RadioGroup,
    FormControlLabel,
    Input,
    Stack
} from '@mui/material';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import React, { useContext, useEffect, useRef, useState } from 'react';
import utils from '../../../utils/utils';
import { NumericFormat } from 'react-number-format';
import AppConsts, { HINH_THUC_THANH_TOAN, ISelect, LoaiChungTu } from '../../../lib/appconst';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import { Guid } from 'guid-typescript';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import { format } from 'date-fns';
import AutocompleteAccountBank from '../../../components/Autocomplete/AccountBank';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import BankAccount from '../../../components/Switch/BankAccount';

export const FORM_TYPE = {
    ThuNgan: 1,
    DSHoaDon: 2
};

const DetailHoaDon = ({
    listAccountBank,
    idAccounBank,
    toggleDetail,
    tongTienHang,
    ptGiamGiaHD_Parent = 0,
    tongGiamGiaHD_Parent = 0,
    hinhThucTT = 1,
    onChangeQuyChiTiet,
    onChangeHoaDon,
    onChangeGhiChuHD,
    onClickThanhToan,
    onChangeTaiKhoanNganHang,
    formType = FORM_TYPE.ThuNgan,
    dataHoaDonAfterSave
}: any) => {
    const arrHinhThucThanhToan = [...AppConsts.hinhThucThanhToan, { value: 0, text: 'Kết hợp' }];
    const [idHinhThucTT, setIdHinhThucTT] = React.useState(hinhThucTT);
    const [idTaiKhoanNganHang, setIdTaiKhoanNganHang] = React.useState(idAccounBank);

    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const noHDCu = utils.RoundDecimal(dataHoaDonAfterSave?.conNo ?? 0);

    const [tongGiamGiaHD, setTongGiamGiaHD] = useState(0);
    const [ptGiamGiaHD, setPTGiamGiaHD] = useState(0);
    const [laPTGiamGia, setlaPTGiamGia] = useState(true);
    const [ghichuHD, setGhichuHD] = useState('');
    const [khachPhaiTra, setKhachPhaiTra] = useState(0);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);

    const [tienKhachTraMax, setTienKhachTraMax] = useState(0);
    const [lstQuyCT, setLstQuyCT] = useState<QuyChiTietDto[]>([
        new QuyChiTietDto({
            hinhThucThanhToan: hinhThucTT,
            tienThu: formType === FORM_TYPE.ThuNgan ? tongTienHang : noHDCu
        })
    ]);

    // pass data from parent to child
    useEffect(() => {
        console.log('formTT');
        const khachPhaiTra = formType === FORM_TYPE.ThuNgan ? tongTienHang - tongGiamGiaHD_Parent : noHDCu;
        setPTGiamGiaHD(ptGiamGiaHD_Parent);
        setTongGiamGiaHD(tongGiamGiaHD_Parent);
        setKhachPhaiTra(khachPhaiTra);
        if (ptGiamGiaHD_Parent > 0 || (ptGiamGiaHD_Parent === 0 && tongGiamGiaHD_Parent === 0)) {
            setlaPTGiamGia(true);
        } else {
            setlaPTGiamGia(false);
        }

        setTienKhachTraMax(khachPhaiTra);
        setSumTienKhachTra(khachPhaiTra);
        setTienThuaTraKhach(0);
    }, []);

    // change hinhThucTT at parent- -> update to child
    useEffect(() => {
        setIdHinhThucTT(hinhThucTT);

        switch (hinhThucTT) {
            case HINH_THUC_THANH_TOAN.KET_HOP:
                {
                    //
                }
                break;
            default:
                {
                    setLstQuyCT(
                        lstQuyCT.map((itemCT: QuyChiTietDto) => {
                            return {
                                ...itemCT,
                                hinhThucThanhToan: hinhThucTT
                            };
                        })
                    );
                }
                break;
        }
    }, [hinhThucTT]);

    useEffect(() => {
        setIdTaiKhoanNganHang(idAccounBank);

        // find accBacnk
        const itemAcc = listAccountBank?.filter((x: TaiKhoanNganHangDto) => x.id === idAccounBank);
        let tenNganHang = '',
            tenChuThe = '',
            soTaiKhoan = '',
            maPinNganHang = '';
        if (itemAcc?.length > 0) {
            tenNganHang = itemAcc[0].tenNganHang;
            tenChuThe = itemAcc[0].tenChuThe;
            soTaiKhoan = itemAcc[0].soTaiKhoan;
            maPinNganHang = itemAcc[0].maPinNganHang;
        }

        switch (hinhThucTT) {
            case HINH_THUC_THANH_TOAN.KET_HOP:
                {
                    //
                }
                break;
            default:
                {
                    setLstQuyCT(
                        lstQuyCT.map((itemCT: QuyChiTietDto) => {
                            return {
                                ...itemCT,
                                idTaiKhoanNganHang: idAccounBank,
                                tenNganHang: tenNganHang,
                                tenChuThe: tenChuThe,
                                soTaiKhoan: soTaiKhoan,
                                maPinNganHang: maPinNganHang
                            };
                        })
                    );
                }
                break;
        }
    }, [idAccounBank]);

    const onClickPTramVND = (newVal: boolean) => {
        let gtriPT = 0;
        if (!laPTGiamGia) {
            if (newVal && tongTienHang > 0) {
                gtriPT = (tongGiamGiaHD / tongTienHang) * 100;
                setPTGiamGiaHD(gtriPT);
            }
        }
        setlaPTGiamGia(newVal);
        changeGiamGia_passToParent(gtriPT, tongGiamGiaHD);
    };

    const onChangeGtriGiamGia = (gtri: string) => {
        let gtriNew = utils.formatNumberToFloat(gtri);
        let ptGiamGiaNew = 0;
        if (gtriNew > tongTienHang) {
            gtriNew = tongTienHang;
        }
        let gtriVND = 0;
        if (tongTienHang > 0) {
            if (laPTGiamGia) {
                gtriVND = (gtriNew * tongTienHang) / 100;
                ptGiamGiaNew = gtriNew;
            } else {
                gtriVND = gtriNew;
            }
        }
        setPTGiamGiaHD(ptGiamGiaNew);
        setTongGiamGiaHD(gtriVND);

        changeGiamGia_passToParent(ptGiamGiaNew, gtriVND);
    };

    const gtriXX = laPTGiamGia ? ptGiamGiaHD : tongGiamGiaHD;

    const onChangeTienKhachTra = (gtri: string, loai: number) => {
        const gtriNhapNew = utils.formatNumberToFloat(gtri);
        let lstQuyCTNew: QuyChiTietDto[] = [];
        if (hinhThucTT === HINH_THUC_THANH_TOAN.KET_HOP) {
            // tinh lai  tien
            switch (loai) {
                case HINH_THUC_THANH_TOAN.TIEN_MAT: // tinhtien chuyenkhoan
                    {
                        const conLai = tienKhachTraMax - gtriNhapNew;
                        lstQuyCTNew = lstQuyCT.map((item: QuyChiTietDto) => {
                            if (item.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT) {
                                return { ...item, tienThu: gtriNhapNew };
                            } else {
                                if (item.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN) {
                                    return { ...item, tienThu: conLai > 0 ? conLai : 0 };
                                } else {
                                    return { ...item, tienThu: 0 };
                                }
                            }
                        });

                        setTienThuaTraKhach(0);
                    }

                    break;
                case HINH_THUC_THANH_TOAN.CHUYEN_KHOAN: // tinhtien pos
                    {
                        const sumTienMat = lstQuyCT
                            .filter((x: QuyChiTietDto) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT)
                            .reduce((currentValue: number, item: QuyChiTietDto) => {
                                return item.tienThu + currentValue;
                            }, 0);
                        const conLai = tienKhachTraMax - sumTienMat - gtriNhapNew;
                        lstQuyCTNew = lstQuyCT.map((item: QuyChiTietDto) => {
                            if (item.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT) {
                                return { ...item };
                            } else {
                                if (item.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN) {
                                    return { ...item, tienThu: gtriNhapNew };
                                } else {
                                    return { ...item, tienThu: conLai > 0 ? conLai : 0 };
                                }
                            }
                        });

                        setTienThuaTraKhach(0);
                    }
                    break;
                case HINH_THUC_THANH_TOAN.QUYET_THE:
                    {
                        const sumMatCK = lstQuyCT
                            .filter((x: QuyChiTietDto) => x.hinhThucThanhToan !== HINH_THUC_THANH_TOAN.QUYET_THE)
                            .reduce((currentValue: number, item: QuyChiTietDto) => {
                                return item.tienThu + currentValue;
                            }, 0);
                        const tongTT = sumMatCK + gtriNhapNew;
                        let tienthua = 0;
                        if (tongTT !== khachPhaiTra) {
                            tienthua = tongTT - khachPhaiTra;

                            lstQuyCTNew = lstQuyCT.map((item: QuyChiTietDto) => {
                                if (item.hinhThucThanhToan !== HINH_THUC_THANH_TOAN.QUYET_THE) {
                                    return { ...item };
                                } else {
                                    return { ...item, tienThu: gtriNhapNew };
                                }
                            });
                        } else {
                            lstQuyCTNew = lstQuyCT;
                        }
                        setSumTienKhachTra(tongTT);
                        setTienThuaTraKhach(tienthua);
                        setTienKhachTraMax(tongTT);
                    }
                    break;
            }
        } else {
            lstQuyCTNew = lstQuyCT.map((item: QuyChiTietDto) => {
                if (item.hinhThucThanhToan === loai) {
                    return { ...item, tienThu: gtriNhapNew };
                } else {
                    return { ...item };
                }
            });
            setSumTienKhachTra(gtriNhapNew);
            setTienThuaTraKhach(gtriNhapNew - khachPhaiTra);
        }

        setLstQuyCT([...lstQuyCTNew]);
        if (formType === FORM_TYPE.ThuNgan) {
            onChangeQuyChiTiet(lstQuyCTNew);
        }
    };

    const changeTaiKhoanNganHang = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanNganHang(item?.id);

        setLstQuyCT(
            lstQuyCT.map((itemCT: QuyChiTietDto) => {
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
        );

        if (formType === FORM_TYPE.ThuNgan) {
            onChangeTaiKhoanNganHang(item);
        }
    };

    const GetData_forHinhThucKetHop = () => {
        const arr: QuyChiTietDto[] = [
            new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT, tienThu: 0 }),
            new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.CHUYEN_KHOAN, tienThu: 0 }),
            new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.QUYET_THE, tienThu: 0 })
        ];
        return arr;
    };

    const GetData_forMatPosCK = (idAccounBank: string | null) => {
        const itemAcc = listAccountBank?.filter((x: TaiKhoanNganHangDto) => x.id === idAccounBank);
        let tenNganHang = '',
            tenChuThe = '',
            soTaiKhoan = '',
            maPinNganHang = '';
        if (itemAcc?.length > 0) {
            tenNganHang = itemAcc[0].tenNganHang;
            tenChuThe = itemAcc[0].tenChuThe;
            soTaiKhoan = itemAcc[0].soTaiKhoan;
            maPinNganHang = itemAcc[0].maPinNganHang;
        }
        return new QuyChiTietDto({
            tienThu: sumTienKhachTra,
            idTaiKhoanNganHang: idAccounBank as unknown as undefined,
            tenNganHang: tenNganHang,
            tenChuThe: tenChuThe,
            soTaiKhoan: soTaiKhoan,
            maPinNganHang: maPinNganHang
        });
    };

    const choseHinhThucThanhToan = (item: ISelect) => {
        const hinhthucNew = item.value as number;
        setIdHinhThucTT(hinhthucNew);

        // update hinhThucTT at parent
        // keep value old of tienKhachDua
        let lstQuyCTNew: QuyChiTietDto[] = [];

        // nếu hinhthucTT cũ = mặt, và chuyển sang hình thức TT mới --> get default tk nganhang
        // else keep value idTaiKhoanNganHang

        if (idHinhThucTT === HINH_THUC_THANH_TOAN.TIEN_MAT && hinhthucNew !== HINH_THUC_THANH_TOAN.TIEN_MAT) {
            const accDefault = listAccountBank?.filter((x: TaiKhoanNganHangDto) => x.isDefault);
            let accFirst: TaiKhoanNganHangDto = {} as TaiKhoanNganHangDto;
            if (accDefault.length > 0) {
                accFirst = accDefault[0];
            } else {
                if (listAccountBank?.length > 0) {
                    accFirst = listAccountBank[0];
                }
            }
            setIdTaiKhoanNganHang(accFirst?.id);

            switch (hinhthucNew) {
                case HINH_THUC_THANH_TOAN.KET_HOP:
                    {
                        // reset to tienMat
                        lstQuyCTNew = GetData_forHinhThucKetHop();
                        lstQuyCTNew = lstQuyCTNew.map((itemCT: QuyChiTietDto) => {
                            if (itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT) {
                                return {
                                    ...itemCT,
                                    tienThu: sumTienKhachTra,
                                    idTaiKhoanNganHang: null
                                };
                            } else {
                                return {
                                    ...itemCT,
                                    tienThu: 0,
                                    idTaiKhoanNganHang: accFirst?.id as unknown as string,
                                    tenNganHang: accFirst?.tenNganHang,
                                    tenChuThe: accFirst?.tenChuThe,
                                    soTaiKhoan: accFirst?.soTaiKhoan,
                                    maPinNganHang: accFirst?.maPinNganHang
                                };
                            }
                        });
                    }
                    break;
                default:
                    {
                        lstQuyCTNew = [GetData_forMatPosCK(accFirst?.id)];
                        lstQuyCTNew[0].hinhThucThanhToan = hinhthucNew;
                    }
                    break;
            }
        } else {
            switch (hinhthucNew) {
                case HINH_THUC_THANH_TOAN.KET_HOP:
                    {
                        // reset to tienMat
                        lstQuyCTNew = GetData_forHinhThucKetHop();
                        lstQuyCTNew = lstQuyCTNew.map((itemCT: QuyChiTietDto) => {
                            if (itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT) {
                                return {
                                    ...itemCT,
                                    tienThu: sumTienKhachTra
                                };
                            } else {
                                // get idtaikhoanngan old
                                const itemAcc = listAccountBank?.filter(
                                    (x: TaiKhoanNganHangDto) => x.id === idTaiKhoanNganHang
                                );
                                let tenNganHang = '',
                                    tenChuThe = '',
                                    soTaiKhoan = '',
                                    maPinNganHang = '';
                                if (itemAcc?.length > 0) {
                                    tenNganHang = itemAcc[0].tenNganHang;
                                    tenChuThe = itemAcc[0].tenChuThe;
                                    soTaiKhoan = itemAcc[0].soTaiKhoan;
                                    maPinNganHang = itemAcc[0].maPinNganHang;
                                }
                                return {
                                    ...itemCT,
                                    idTaiKhoanNganHang: idTaiKhoanNganHang,
                                    tenNganHang: tenNganHang,
                                    tenChuThe: tenChuThe,
                                    soTaiKhoan: soTaiKhoan,
                                    maPinNganHang: maPinNganHang,
                                    tienThu: 0
                                };
                            }
                        });
                    }
                    break;
                default:
                    {
                        lstQuyCTNew = [GetData_forMatPosCK(idTaiKhoanNganHang)];
                        lstQuyCTNew[0].hinhThucThanhToan = hinhthucNew;
                    }
                    break;
            }
        }

        setLstQuyCT(() => [...lstQuyCTNew]);
        if (formType === FORM_TYPE.ThuNgan) {
            onChangeQuyChiTiet(lstQuyCTNew);
        }
    };

    const changeGiamGia_passToParent = (ptGiamNew: number, tongGiamNew: number) => {
        const khachPhaiTraNew = formType === FORM_TYPE.ThuNgan ? tongTienHang - tongGiamNew : noHDCu;
        // quyCT: only change tienThu
        switch (hinhThucTT) {
            case HINH_THUC_THANH_TOAN.KET_HOP:
                {
                    // reset to tienMat
                    setLstQuyCT(
                        lstQuyCT.map((itemCT: QuyChiTietDto) => {
                            if (itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT) {
                                return {
                                    ...itemCT,
                                    tienThu: khachPhaiTraNew
                                };
                            } else {
                                return {
                                    ...itemCT,
                                    tienThu: 0
                                };
                            }
                        })
                    );
                }
                break;
            default:
                {
                    setLstQuyCT(
                        lstQuyCT.map((itemCT: QuyChiTietDto) => {
                            return {
                                ...itemCT,
                                tienThu: khachPhaiTraNew
                            };
                        })
                    );
                }
                break;
        }
        if (formType === FORM_TYPE.ThuNgan) {
            onChangeHoaDon(ptGiamNew, tongGiamNew, khachPhaiTraNew);
            setTienKhachTraMax(khachPhaiTraNew);
            setSumTienKhachTra(khachPhaiTraNew);
            setKhachPhaiTra(khachPhaiTraNew);
            setTienThuaTraKhach(0);
        }
    };

    const clickThanhToan = async () => {
        let tongThuThucTe = sumTienKhachTra;
        if (formType !== FORM_TYPE.ThuNgan) {
            // DS hóa đơn - thanh toán công nợ:  lưu phiếu thu
            tongThuThucTe = await savePhieuThu();
        }
        onClickThanhToan(tongThuThucTe);
    };

    const savePhieuThu = async () => {
        const lstQCT_After = SoQuyServices.AssignAgainQuyChiTiet(lstQuyCT, sumTienKhachTra, noHDCu);

        // save soquy (Mat, POS, ChuyenKhoan)
        const tongThu = lstQCT_After.reduce((currentValue: number, item) => {
            return currentValue + item.tienThu;
        }, 0);
        const quyHD: QuyHoaDonDto = new QuyHoaDonDto({
            idChiNhanh: utils.checkNull(dataHoaDonAfterSave.idChiNhanh) ? idChiNhanh : dataHoaDonAfterSave?.idChiNhanh,
            idLoaiChungTu: LoaiChungTu.PHIEU_THU,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            tongTienThu: tongThu,
            noiDungThu: ghichuHD
        });
        // assign idHoadonLienQuan, idKhachHang for quyCT
        lstQCT_After.map((x: QuyChiTietDto) => {
            x.idHoaDonLienQuan = dataHoaDonAfterSave?.id;
            x.idKhachHang = dataHoaDonAfterSave.idKhachHang == Guid.EMPTY ? null : dataHoaDonAfterSave?.idKhachHang;
        });
        quyHD.quyHoaDon_ChiTiet = lstQCT_After;
        await SoQuyServices.CreateQuyHoaDon(quyHD); // todo hoahong NV hoadon
        return tongThu;
    };

    return (
        <>
            <Box
                sx={{
                    padding: '24px',
                    boxShadow: '1px 5px 22px 4px #00000026',
                    height: '100%',
                    marginX: 'auto',
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        pointerEvents: 'none',
                        height: '40px',
                        left: '0',
                        width: '100%'
                    }
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h3" color="#29303D" fontSize="24px" fontWeight="700">
                        {formType === FORM_TYPE.ThuNgan ? 'Chi tiết hóa đơn' : 'Thông tin thanh toán'}
                    </Typography>
                    <IconButton
                        sx={{
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}
                        onClick={toggleDetail}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: formType == FORM_TYPE.ThuNgan ? 'flex' : 'none',
                        justifyContent: 'space-between'
                    }}>
                    {' '}
                    <Typography variant="body1" color="#3B4758" fontSize="14px">
                        Tổng tiền hàng
                    </Typography>
                    <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="14px">
                        {new Intl.NumberFormat('vi-VN').format(tongTienHang)}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: formType == FORM_TYPE.ThuNgan ? 'flex' : 'none',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <Typography variant="body1" color="#3B4758" fontSize="14px">
                        Giảm giá
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'stretch',
                            gap: '16px'
                        }}>
                        <NumericFormat
                            size="medium"
                            fullWidth
                            value={gtriXX}
                            decimalSeparator=","
                            thousandSeparator="."
                            isAllowed={(values) => {
                                const floatValue = values.floatValue;
                                if (laPTGiamGia) return (floatValue ?? 0) <= 100; // neu %: khong cho phep nhap qua 100%
                                if (!laPTGiamGia) return (floatValue ?? 0) <= tongTienHang;
                                return true;
                            }}
                            sx={{
                                '& input': {
                                    paddingY: '13.5px'
                                }
                            }}
                            customInput={TextField}
                            onChange={(event) => onChangeGtriGiamGia(event.target.value)}
                        />
                        <ButtonGroup
                            sx={{
                                '& button': {
                                    transition: '.3s'
                                }
                            }}>
                            <Button
                                onClick={() => onClickPTramVND(true)}
                                sx={{
                                    bgcolor: laPTGiamGia ? 'var(--color-main)' : 'white',
                                    borderRight: '0!important',
                                    color: laPTGiamGia ? 'white' : 'black'
                                }}>
                                %
                            </Button>
                            <Button
                                onClick={() => onClickPTramVND(false)}
                                sx={{
                                    color: !laPTGiamGia ? 'white' : 'black',
                                    borderLeft: '0!important',
                                    bgcolor: !laPTGiamGia ? 'var(--color-main)' : 'white'
                                }}>
                                đ
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" color="#3D475C" fontWeight="700" fontSize="16px">
                        {formType == FORM_TYPE.ThuNgan ? 'Thanh toán' : 'Còn nợ'}
                    </Typography>
                    <Typography variant="body1" color="#29303D" fontWeight="700" fontSize="16px">
                        {new Intl.NumberFormat('vi-VN').format(khachPhaiTra)}
                    </Typography>
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
                        {hinhThucTT !== HINH_THUC_THANH_TOAN.KET_HOP && (
                            <NumericFormat
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        paddingY: '13.5px',
                                        textAlign: 'right',
                                        fontWeight: 500
                                    }
                                }}
                                decimalSeparator=","
                                thousandSeparator="."
                                customInput={TextField}
                                value={sumTienKhachTra}
                                onChange={(event) => onChangeTienKhachTra(event.target.value, idHinhThucTT)}
                            />
                        )}
                        {hinhThucTT === HINH_THUC_THANH_TOAN.KET_HOP && (
                            <NumericFormat
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        paddingY: '13.5px',
                                        textAlign: 'right',
                                        fontWeight: 500
                                    }
                                }}
                                decimalSeparator=","
                                thousandSeparator="."
                                customInput={TextField}
                                value={tienKhachTraMax}
                                onChange={(event) => setTienKhachTraMax(utils.formatNumberToFloat(event.target.value))}
                            />
                        )}
                    </Grid>

                    {idHinhThucTT === 0 ? (
                        <Grid container spacing="16px">
                            {lstQuyCT.map((item, index) => (
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
                                                outline: 'none',
                                                fontWeight: 500
                                            },
                                            '& input::-webkit-outer-spin-button,& input::-webkit-inner-spin-button': {
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
                                        lstBankAccount={listAccountBank}
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
                                    {tienThuaTraKhach > 0 ? 'Tiền thừa' : 'Tiền khách thiếu'}
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
                    <Typography fontSize="14px" color="#525F7A">
                        Ghi chú
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={ghichuHD}
                        onChange={(e) => {
                            setGhichuHD(e.target.value);
                            if (formType === 1) {
                                onChangeGhiChuHD(e.target.value);
                            }
                        }}></TextField>
                </Box>
                <Button
                    variant="contained"
                    className="btn-container-hover"
                    sx={{
                        width: '158px',
                        marginX: 'auto',
                        mt: 'auto',
                        mb: '5px',
                        paddingY: '14px',
                        fontSize: '16px'
                    }}
                    onClick={clickThanhToan}>
                    Thanh toán
                </Button>
            </Box>
        </>
    );
};
export default DetailHoaDon;
