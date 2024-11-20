import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, Tabs, Tab, TextField, Dialog, IconButton, Link, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';

import PrintIcon from '@mui/icons-material/Print';
import TabInfo from './Tab_info';
import TabDiary from './Tab_diary';
import { ReactComponent as ArrowIcon } from '../../../images/arrow_back.svg';
import ModalWarning from './Modal_warning';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import DateTimePickerCustom from '../../../components/DatetimePicker/DateTimePickerCustom';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';

import AutocompleteChiNhanh from '../../../components/Autocomplete/ChiNhanh';
import ModalEditChiTietGioHang from '../thu_ngan/modal_edit_chitiet';
import { ChiNhanhDto } from '../../../services/chi_nhanh/Dto/chiNhanhDto';
import { Stack } from '@mui/system';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import utils from '../../../utils/utils';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import DetailHoaDon from '../thu_ngan/DetailHoaDon';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import MauInServices from '../../../services/mau_in/MauInServices';
import TaiKhoanNganHangServices from '../../../services/so_quy/TaiKhoanNganHangServices';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import HoaHongNhanVienHoaDon from '../../nhan_vien_thuc_hien/hoa_hong_nhan_vien_hoa_don';
import abpCustom from '../../../components/abp-custom';
import { SuggestTaiKhoanNganHangQrDto } from '../../../services/suggests/dto/SuggestTaiKhoanNganHangQrDTo';
import suggestStore from '../../../stores/suggestStore';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../../utils/PropParentToChild';
import { TrangThaiHoaDon } from '../../../services/ban_hang/HoaDonConst';
import { LoaiNhatKyThaoTac, TypeAction } from '../../../lib/appconst';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import Cookies from 'js-cookie';
import uploadFileService from '../../../services/uploadFileService';
import ModalAddCustomerCheckIn from '../../check_in/modal_add_cus_checkin';
import { PageKhachHangCheckInDto } from '../../../services/check_in/CheckinDto';
import { Guid } from 'guid-typescript';
const themOutlineInput = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px'
                }
            }
        }
    }
});

const ThongTinHoaDon = ({ idHoaDon, hoadon, handleGotoBack, open }: any) => {
    const appContext = useContext(AppContext);
    const [openDialog, setOpenDialog] = useState(false);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [isShowModalThanhToan, setIsShowModalThanhToan] = useState(false);

    const [hoadonChosed, setHoaDonChosed] = useState<PageHoaDonDto>(new PageHoaDonDto({ id: '' }));
    const [chitietHoaDon, setChiTietHoaDon] = useState<PageHoaDonChiTietDto[]>([]);

    const [ptGiamGia, setPTGiamGia] = useState(0);
    const [giaTriGiamGia, setGiaTriGiamGia] = useState(0);

    const [isShowModalCheckIn, setIsShowModalCheckIn] = useState(false);

    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [idCTHDChosing, setIdCTHDChosing] = useState('');
    const [typeAction, setTypeAction] = useState(TypeAction.NOTHING); //  -1. khong lam gi
    const [isShowHoaHongHD, setIsShowHoaHongHD] = useState(false);
    const [inforConfirm, setinforConfirm] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const [taiKhoanNganHang, setTaiKhoanNganHang] = useState<SuggestTaiKhoanNganHangQrDto>({
        id: null,
        bin: '',
        soTaiKhoan: '',
        tenRutGon: '',
        tenTaiKhoan: ''
    });

    const GetChiTietHoaDon_byIdHoaDon = async () => {
        if (!utils.checkNull(idHoaDon)) {
            const data = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(idHoaDon);
            setChiTietHoaDon(data);
        }
    };

    useEffect(() => {
        GetChiTietHoaDon_byIdHoaDon();
        setHoaDonChosed(hoadon);
        setTypeAction(TypeAction.NOTHING);
    }, [idHoaDon]);

    const changeTaiKhoanNganHang = async (item: TaiKhoanNganHangDto) => {
        setTaiKhoanNganHang({
            id: item?.id,
            soTaiKhoan: item?.soTaiKhoan,
            tenRutGon: item?.tenRutGon,
            tenTaiKhoan: item?.tenChuThe,
            bin: item?.maPinNganHang
        });
    };

    const changeNgayLapHoaDon = (value: any) => {
        setHoaDonChosed({ ...hoadonChosed, ngayLapHoaDon: value });
    };

    const changeChiNhanh = (item: ChiNhanhDto) => {
        setHoaDonChosed({ ...hoadonChosed, idChiNhanh: item?.id });
    };

    const gotoBack = () => {
        // chi dong hoadon thoi
        handleGotoBack(hoadonChosed, typeAction);
    };

    const checkSave = async () => {
        // if tongtien > tongtienold
        if (hoadon?.tongThanhToan > hoadonChosed?.tongThanhToan) {
            setObjAlert({ ...objAlert, show: true, mes: 'Tổng tiền hàng > Tổng cũ' });
        }
    };

    const huyHoaDon = async () => {
        setOpenDialog(false);
        await HoaDonService.DeleteHoaDon(idHoaDon);
        await SoQuyServices.HuyPhieuThuChi_ofHoaDonLienQuan(idHoaDon);

        // update state hoadon
        const objUpdate = { ...hoadonChosed };
        objUpdate.trangThai = TrangThaiHoaDon.HUY;
        setHoaDonChosed({ ...hoadonChosed, trangThai: TrangThaiHoaDon.HUY });
        setTypeAction(TypeAction.DELETE);
        handleGotoBack(objUpdate, TypeAction.DELETE);

        const diary = {
            idChiNhanh: appContext?.chinhanhCurrent?.id ?? hoadon?.idChiNhanh,
            chucNang: `Danh mục hóa đơn`,
            noiDung: `Xóa hóa đơn ${hoadonChosed?.maHoaDon}`,
            noiDungChiTiet: `Xóa hóa đơn ${hoadonChosed?.maHoaDon} của khách hàng ${hoadonChosed?.tenKhachHang} (${hoadonChosed?.maKhachHang}) `,
            loaiNhatKy: LoaiNhatKyThaoTac.DELETE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const showModalEditGioHang = () => {
        setIsShowEditGioHang(true);
        setIdCTHDChosing('');
    };

    const tabInfor_onChangeGiamGia = (ptGiamGia: number, giaTriGiamGia: number) => {
        // why this is rerender
        //setPTGiamGia(ptGiamGia);
        // setGiaTriGiamGia(giaTriGiamGia);
        // setTongThanhToan(0);
    };

    const AgreeGioHang = async (lstCTAfter: PageHoaDonChiTietDto[]) => {
        setTypeAction(TypeAction.UPDATE);
        setIsShowEditGioHang(false);
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật chi tiết hóa đơn thành công' });
        setChiTietHoaDon([...lstCTAfter]);

        // caculator TongTien
        let tongTienHangChuaChietKhau = 0,
            tongChietKhauHangHoa = 0,
            tongTienHang = 0,
            tongTienThue = 0,
            tongTienHDSauVAT = 0,
            tongThanhToan = 0;
        for (let i = 0; i < lstCTAfter.length; i++) {
            const ctFor = lstCTAfter[i];
            tongTienHangChuaChietKhau += ctFor?.thanhTienTruocCK ?? 0;
            tongChietKhauHangHoa += (ctFor?.soLuong ?? 0) * (ctFor?.tienChietKhau ?? 0);
            tongTienHang += ctFor?.thanhTienSauCK ?? 0;
            tongTienThue += (ctFor?.soLuong ?? 0) * (ctFor?.tienThue ?? 0);
            tongTienHDSauVAT += ctFor?.thanhTienSauVAT ?? 0;
        }

        let giamGiaHD = hoadon?.tongGiamGiaHD ?? 0;
        if (hoadon?.ptGiamGiaHD > 0) {
            giamGiaHD = (tongTienHang * hoadon?.ptGiamGiaHD) / 100;
        }
        tongThanhToan = tongTienHDSauVAT - giamGiaHD;

        const objHDAfter = { ...hoadonChosed };
        objHDAfter.tongTienHangChuaChietKhau = tongTienHangChuaChietKhau;
        objHDAfter.tongChietKhauHangHoa = tongChietKhauHangHoa;
        objHDAfter.tongTienHang = tongTienHang;
        objHDAfter.tongTienThue = tongTienThue;
        objHDAfter.tongTienHDSauVAT = tongTienHDSauVAT;
        objHDAfter.tongThanhToan = tongThanhToan;
        objHDAfter.tongGiamGiaHD = giamGiaHD;

        console.log('objHDAfter ', objHDAfter);
        const data = await HoaDonService.Update_InforHoaDon(objHDAfter);
        setHoaDonChosed({
            ...hoadonChosed,
            tongTienHangChuaChietKhau: tongTienHangChuaChietKhau,
            tongChietKhauHangHoa: tongChietKhauHangHoa,
            tongTienHang: tongTienHang,
            tongTienThue: tongTienThue,
            tongTienHDSauVAT: tongTienHDSauVAT,
            tongGiamGiaHD: giamGiaHD,
            tongThanhToan: tongThanhToan,
            maHoaDon: data?.maHoaDon,
            conNo: tongThanhToan - (hoadonChosed?.daThanhToan ?? 0)
        });
    };
    const updateHoaDon = async () => {
        hoadonChosed.pTGiamGiaHD = ptGiamGia;
        hoadonChosed.tongGiamGiaHD = giaTriGiamGia;
        hoadonChosed.tongThanhToan = hoadonChosed?.tongTienHang - giaTriGiamGia;
        const data = await HoaDonService.Update_InforHoaDon(hoadonChosed);
        setHoaDonChosed({ ...hoadonChosed, maHoaDon: data?.maHoaDon });
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật thông tin hóa đơn thành công' });
        handleGotoBack(hoadonChosed, TypeAction.UPDATE);
    };

    // thanhtoan congno hoadon
    const savePhieuThuOK = (tongThunew = 0) => {
        setObjAlert({ ...objAlert, show: true, mes: 'Thanh toán hóa đơn thành công' });
        setIsShowModalThanhToan(false);
        setTypeAction(TypeAction.UPDATE);
        setHoaDonChosed({
            ...hoadonChosed,
            daThanhToan: (hoadonChosed?.daThanhToan ?? 0) + tongThunew,
            conNo: (hoadonChosed?.conNo ?? 0) - tongThunew
        });
    };

    // hoahong NV theo hoadon
    const showModalHoaHongHD = async () => {
        setIsShowHoaHongHD(true);
    };

    const AgreeConfirm = async () => {
        const data = await HoaDonService.KhoiPhucHoaDon(hoadonChosed?.id ?? '');
        if (!data) {
            setObjAlert({ ...objAlert, show: true, type: 2, mes: 'Khôi phục hóa đơn không thành công' });
            return;
        }
        const objUpdate = { ...hoadonChosed };
        objUpdate.trangThai = TrangThaiHoaDon.HOAN_THANH;
        setHoaDonChosed({ ...hoadonChosed, trangThai: TrangThaiHoaDon.HOAN_THANH });
        setTypeAction(TypeAction.RESTORE);
        handleGotoBack(objUpdate, TypeAction.RESTORE);
        setObjAlert({ ...objAlert, show: true, mes: 'Khôi phục hóa đơn thành công' });
        setinforConfirm({ ...inforConfirm, show: false });

        const diary = {
            idChiNhanh: appContext?.chinhanhCurrent?.id ?? hoadon?.idChiNhanh,
            chucNang: `Danh mục hóa đơn`,
            noiDung: `Khôi phục hóa đơn ${hoadonChosed?.maHoaDon}`,
            noiDungChiTiet: `Khôi phục hóa đơn ${hoadonChosed?.maHoaDon} của khách hàng ${hoadonChosed?.tenKhachHang} (${hoadonChosed?.maKhachHang}) `,
            loaiNhatKy: LoaiNhatKyThaoTac.RESTORE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const InHoaDon = async () => {
        DataMauIn.hoadon = { ...hoadonChosed };
        DataMauIn.hoadonChiTiet = [...chitietHoaDon];
        DataMauIn.khachhang = {
            maKhachHang: hoadonChosed?.maKhachHang,
            tenKhachHang: hoadonChosed?.tenKhachHang,
            soDienThoai: hoadon?.soDienThoai
        } as KhachHangItemDto;
        DataMauIn.chinhanh = { tenChiNhanh: hoadon?.tenChiNhanh } as ChiNhanhDto;
        DataMauIn.congty = appContext.congty;
        DataMauIn.congty.logo = uploadFileService.GoogleApi_NewLink(DataMauIn.congty?.logo);
        const tempMauIn = await MauInServices.GetContentMauInMacDinh(1, 1);
        let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
        newHtml = DataMauIn.replaceChiNhanh(newHtml);
        newHtml = DataMauIn.replaceHoaDon(newHtml);

        if (newHtml.includes('QRCode')) {
            // Nếu mẫu in có mã QR, luôn luôn in ra QRCode mặc định
            let qrCode = '';
            // get default first tknganhang (order by createtime desc)
            const firstAcc = await TaiKhoanNganHangServices.GetDefault_TaiKhoanNganHang(
                hoadonChosed.idChiNhanh as undefined
            );
            if (firstAcc !== null) {
                qrCode = await TaiKhoanNganHangServices.GetQRCode(
                    {
                        tenChuThe: firstAcc.tenChuThe,
                        soTaiKhoan: firstAcc.soTaiKhoan,
                        tenNganHang: firstAcc.tenNganHang,
                        maPinNganHang: firstAcc.maPinNganHang
                    } as TaiKhoanNganHangDto,
                    hoadonChosed.tongThanhToan
                );
            }
            newHtml = newHtml.replace('{QRCode}', `<img style="width: 100%" src=${qrCode} />`);
        }
        DataMauIn.Print(newHtml);
    };

    const showModalChangeCustomer = () => {
        setIsShowModalCheckIn(true);
    };

    const onChangeCustomer = async (typeAction: number, item: PageKhachHangCheckInDto | undefined) => {
        // todo: update again to KH_Checkin ??  có nên không?
        const dataHD = await HoaDonService.UpdateCustomer_toHoaDon(hoadonChosed.id, item?.idKhachHang ?? Guid.EMPTY);
        await SoQuyServices.UpdateCustomer_toQuyChiTiet(hoadonChosed.id, item?.idKhachHang ?? Guid.EMPTY);
        if (dataHD) {
            const diary = {
                idChiNhanh: Cookies.get('IdChiNhanh') ?? hoadon?.idChiNhanh,
                chucNang: `Danh mục hóa đơn`,
                noiDung: `Thay đổi khách hàng cho hóa đơn ${hoadon?.maHoaDon}`,
                noiDungChiTiet: `Khách hàng mới:  ${item?.tenKhachHang} (${item?.maKhachHang}) <br /> Khách hàng cũ: ${hoadon?.tenKhachHang} (${hoadon?.maKhachHang}) `,
                loaiNhatKy: LoaiNhatKyThaoTac.UPDATE
            } as CreateNhatKyThaoTacDto;
            await nhatKyHoatDongService.createNhatKyThaoTac(diary);

            setHoaDonChosed({
                ...hoadonChosed,
                idKhachHang: item?.idKhachHang ?? null,
                maKhachHang: item?.maKhachHang ?? 'KL',
                tenKhachHang: item?.tenKhachHang ?? 'Khách lẻ',
                soDienThoai: item?.soDienThoai ?? ''
            });
            setObjAlert({ ...objAlert, mes: 'Bạn vừa thay đổi khách hàng', show: true, type: 1 });
            setTypeAction(TypeAction.UPDATE);
            setIsShowModalCheckIn(false);
        }
    };

    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event: any, newValue: number) => {
        setActiveTab(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        value: number;
        index: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <Box role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </Box>
        );
    };
    return (
        <>
            <ConfirmDelete
                isShow={inforConfirm.show}
                title={inforConfirm.title}
                mes={inforConfirm.mes}
                onOk={AgreeConfirm}
                onCancel={() => setinforConfirm({ ...inforConfirm, show: false })}></ConfirmDelete>
            <Dialog open={isShowModalThanhToan} onClose={() => setIsShowModalThanhToan(false)} maxWidth="md">
                <DetailHoaDon
                    formType={0}
                    listAccountBank={suggestStore?.suggestTaiKhoanNganHangQr}
                    idAccounBank={taiKhoanNganHang?.id ?? ''}
                    toggleDetail={() => setIsShowModalThanhToan(false)}
                    tongTienHang={hoadonChosed?.tongTienHang}
                    dataHoaDonAfterSave={hoadonChosed}
                    onClickThanhToan={savePhieuThuOK}
                    onChangeTaiKhoanNganHang={changeTaiKhoanNganHang}
                />
            </Dialog>
            <HoaHongNhanVienHoaDon
                iShow={isShowHoaHongHD}
                onClose={() => setIsShowHoaHongHD(false)}
                doanhThu={hoadonChosed?.tongTienHang}
                thucThu={hoadonChosed?.daThanhToan}
                idHoaDon={hoadonChosed?.id}
            />
            <ModalAddCustomerCheckIn
                typeForm={0}
                isNew={false}
                isShowModal={isShowModalCheckIn}
                onOK={onChangeCustomer}
                onClose={() => setIsShowModalCheckIn(false)}
            />
            <Dialog open={open} onClose={gotoBack} maxWidth="xl" fullWidth>
                <SnackbarAlert
                    showAlert={objAlert.show}
                    type={objAlert.type}
                    title={objAlert.mes}
                    handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
                <ModalEditChiTietGioHang
                    formType={0}
                    isShow={isShowEditGioHang}
                    hoadonChiTiet={
                        idCTHDChosing === '' ? chitietHoaDon : chitietHoaDon.filter((x: any) => x.id === idCTHDChosing)
                    }
                    handleSave={AgreeGioHang}
                    handleClose={() => setIsShowEditGioHang(false)}
                />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: 'calc(100vh - 70px)'
                    }}>
                    <ModalWarning open={openDialog} onClose={() => setOpenDialog(false)} onOK={huyHoaDon} />
                    <Box padding="16px 2.2222222222222223vw ">
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs="auto">
                                <Stack gap={1} direction="row">
                                    <Box
                                        sx={{
                                            fontSize: '24px',
                                            color: '#999699'
                                        }}>
                                        Hóa đơn
                                    </Box>
                                    <Box
                                        sx={{
                                            fontSize: '24px',
                                            fontWeight: '700',
                                            color: '#333233'
                                        }}>
                                        {hoadonChosed?.maHoaDon}
                                    </Box>
                                    <PrintIcon
                                        sx={{
                                            color: 'var(--color-main)',
                                            display: abpCustom.isGrandPermission('Pages.HoaDon.Print') ? '' : 'none'
                                        }}
                                        onClick={InHoaDon}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs="auto">
                                <IconButton
                                    onClick={gotoBack}
                                    sx={{
                                        '&:hover svg': {
                                            filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                        }
                                    }}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{
                                mt: '16px',
                                boxShadow: '0px 4px 20px 0px #AAA9B81A',
                                borderRadius: '12px',
                                padding: '24px 24px 0px 24px',
                                bgcolor: '#fff',
                                alignItems: 'center'
                            }}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    '& .MuiFormLabel-root, & legend': {
                                        display: 'none'
                                    },
                                    '& input': {
                                        height: '100%'
                                    }
                                }}>
                                <Stack direction="row" gap={1} alignItems={'center'} spacing={1}>
                                    <PersonIcon sx={{ color: '#b3adad' }} />
                                    <Typography
                                        variant="h4"
                                        color="#3B4758"
                                        fontWeight="700"
                                        fontSize="24px"
                                        title="Thay đổi khách hàng"
                                        sx={{
                                            textDecoration: 'underline',
                                            cursor: 'pointer'
                                        }}
                                        onClick={showModalChangeCustomer}>
                                        {hoadonChosed?.tenKhachHang}
                                    </Typography>
                                    {hoadonChosed?.soDienThoai && (
                                        <Typography
                                            variant="body2"
                                            color={'#b3adad'}>{`(${hoadonChosed?.soDienThoai})`}</Typography>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} marginTop={2}>
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{
                                        '& .MuiFormControl-root': {
                                            width: '100%'
                                        }
                                    }}>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Typography
                                            variant="h5"
                                            fontSize="12px"
                                            color="#999699"
                                            fontWeight="400"
                                            height={24}>
                                            Mã hóa đơn
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            className="inputEdit"
                                            onChange={(event: any) =>
                                                setHoaDonChosed({
                                                    ...hoadonChosed,
                                                    maHoaDon: event.target.value
                                                })
                                            }
                                            value={hoadonChosed?.maHoaDon}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Typography
                                            variant="h5"
                                            fontSize="12px"
                                            color="#999699"
                                            fontWeight="400"
                                            height={24}>
                                            Ngày lập
                                        </Typography>
                                        <ThemeProvider theme={themOutlineInput}>
                                            <DateTimePickerCustom
                                                className="inputEdit"
                                                defaultVal={hoadonChosed?.ngayLapHoaDon}
                                                handleChangeDate={changeNgayLapHoaDon}
                                            />
                                        </ThemeProvider>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Typography
                                            variant="h5"
                                            fontSize="12px"
                                            color="#999699"
                                            fontWeight="400"
                                            height={24}>
                                            Chi nhánh
                                        </Typography>
                                        <ThemeProvider theme={themOutlineInput}>
                                            <AutocompleteChiNhanh
                                                dataChiNhanh={suggestStore?.suggestChiNhanh_byUserLogin}
                                                idChosed={hoadonChosed?.idChiNhanh}
                                                handleChoseItem={changeChiNhanh}
                                            />
                                        </ThemeProvider>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Typography
                                            variant="h5"
                                            fontSize="12px"
                                            color="#999699"
                                            fontWeight="400"
                                            height={24}>
                                            Trạng thái
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className={
                                                hoadonChosed?.trangThai === 3
                                                    ? 'data-grid-cell-trangthai-active'
                                                    : 'data-grid-cell-trangthai-notActive'
                                            }>
                                            {hoadonChosed?.txtTrangThaiHD}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid xs={12} item>
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    sx={{
                                        borderTop: '1px solid #EEF0F4',
                                        paddingTop: '16px',
                                        marginTop: '20px',
                                        '& .MuiTabs-flexContainer': {
                                            gap: '32px'
                                        },
                                        '& button': {
                                            textTransform: 'unset',
                                            color: '#999699',
                                            fontSize: '16px',
                                            fontWeight: '400',
                                            padding: '0',
                                            minWidth: 'unset',
                                            minHeight: 'unset'
                                        },
                                        '& .Mui-selected': {
                                            color: 'var(--color-main)!important'
                                        },
                                        '& .MuiTabs-indicator': {
                                            bgcolor: 'var(--color-main)'
                                        }
                                    }}>
                                    <Tab label="Thông tin" />
                                    <Tab label="Nhật ký thanh toán" />
                                </Tabs>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: '40px' }}>
                            <TabPanel value={activeTab} index={0}>
                                <TabInfo
                                    hoadon={hoadonChosed}
                                    chitietHoaDon={chitietHoaDon}
                                    onSaveOKNVThucHienDV={GetChiTietHoaDon_byIdHoaDon}
                                    onChangeGiamGia={tabInfor_onChangeGiamGia}
                                />
                            </TabPanel>
                            <TabPanel value={activeTab} index={1}>
                                <TabDiary idHoaDon={idHoaDon} />
                            </TabPanel>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            bgcolor: '#fff',
                            width: '100%',
                            padding: '24px 32px',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                        <Box>
                            <Button
                                startIcon={<ArrowIcon />}
                                variant="outlined"
                                sx={{ color: '#3B4758', borderColor: '#3B4758' }}
                                className="btn-outline-hover"
                                onClick={gotoBack}>
                                Quay trở lại
                            </Button>
                        </Box>
                        <Box display="flex" gap="8px">
                            {hoadonChosed?.trangThai === 0 && (
                                <>
                                    <Button
                                        variant="outlined"
                                        sx={{ borderColor: '#3B4758', color: '#4C4B4C' }}
                                        className="btn-outline-hover"
                                        onClick={gotoBack}>
                                        Đóng
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                            display: abpCustom.isGrandPermission('Pages.HoaDon.Restore') ? '' : 'none'
                                        }}
                                        onClick={() => {
                                            // setAction(TypeAction.RESTORE);
                                            setinforConfirm(
                                                new PropConfirmOKCancel({
                                                    show: true,
                                                    title: 'Xác nhận khôi phục',
                                                    mes: `Bạn có chắc chắn muốn khôi phục hóa đơn ${
                                                        hoadonChosed?.maHoaDon ?? ' '
                                                    } không?`
                                                })
                                            );
                                        }}>
                                        Khôi phục
                                    </Button>
                                </>
                            )}
                            {hoadonChosed?.trangThai !== 0 && (
                                <>
                                    <Button
                                        variant="outlined"
                                        sx={{ borderColor: '#3B4758', color: 'var(--color-main)' }}
                                        className="btn-outline-hover"
                                        onClick={showModalHoaHongHD}>
                                        Hoa hồng nhân viên
                                    </Button>
                                    {(hoadonChosed?.conNo ?? 0) > 0 && (
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderColor: '#3B4758',
                                                color: 'var(--color-main)',
                                                display: abpCustom.isGrandPermission('Pages.QuyHoaDon.Create')
                                                    ? ''
                                                    : 'none'
                                            }}
                                            className="btn-outline-hover"
                                            onClick={() => setIsShowModalThanhToan(true)}>
                                            Thanh toán
                                        </Button>
                                    )}

                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#3B4758',
                                            color: 'var(--color-main)',
                                            display: abpCustom.isGrandPermission('Pages.HoaDon.Edit') ? '' : 'none'
                                        }}
                                        className="btn-outline-hover"
                                        onClick={showModalEditGioHang}>
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            color: '#fff',
                                            display: abpCustom.isGrandPermission('Pages.HoaDon.Edit') ? '' : 'none'
                                        }}
                                        className="btn-container-hover"
                                        onClick={updateHoaDon}>
                                        Lưu
                                    </Button>

                                    <Button
                                        onClick={() => setOpenDialog(true)}
                                        variant="contained"
                                        sx={{
                                            transition: '.4s',
                                            bgcolor: '#FF316A!important',
                                            color: '#fff',
                                            '&:hover': {
                                                bgcolor: 'red!important'
                                            },
                                            display: abpCustom.isGrandPermission('Pages.HoaDon.Delete') ? '' : 'none'
                                        }}>
                                        Xóa
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};
export default ThongTinHoaDon;
