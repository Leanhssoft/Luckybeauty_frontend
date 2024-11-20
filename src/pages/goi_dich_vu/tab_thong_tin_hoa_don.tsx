import { Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ButtonOnlyIcon from '../../components/Button/ButtonOnlyIcon';
import DatePickerCustom from '../../components/DatetimePicker/DatePickerCustom';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import ModalAddCustomerCheckIn from '../check_in/modal_add_cus_checkin';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import SoQuyServices from '../../services/so_quy/SoQuyServices';
import { Guid } from 'guid-typescript';
import { LoaiChungTu, LoaiNhatKyThaoTac } from '../../lib/appconst';
import { CreateNhatKyThaoTacDto } from '../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { format } from 'date-fns';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import DataMauIn from '../admin/settings/mau_in/DataMauIn';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { ChiNhanhDto } from '../../services/chi_nhanh/Dto/chiNhanhDto';
import MauInServices from '../../services/mau_in/MauInServices';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import TaiKhoanNganHangServices from '../../services/so_quy/TaiKhoanNganHangServices';
import { TaiKhoanNganHangDto } from '../../services/so_quy/Dto/TaiKhoanNganHangDto';
import { TrangThaiHoaDon } from '../../services/ban_hang/HoaDonConst';
import uploadFileService from '../../services/uploadFileService';
import PaymentsForm from '../ban_hang/thu_ngan/PaymentsForm';
import { FormNumber } from '../../enum/FormNumber';
import abpCustom from '../../components/abp-custom';

const TabThongTinHoaDon: FC<{ itemHD: PageHoaDonDto | null; tongThanhToanNew: number }> = ({
    itemHD,
    tongThanhToanNew
}) => {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;

    const firstLoad = useRef(true);
    const [maHoaDon, setMaHoaDon] = useState<string>('');
    const [ngayLapHoaDon, setNgayLapHoaDon] = useState<string>('');
    const [ghiChuHD, setGhiChuHD] = useState<string>('');
    const [tongThanhToan, setTongThanhToan] = useState(0);
    const [daThanhToan, setDaThanhToan] = useState(0);
    const [conNo, setConNo] = useState(0);
    const [isShowModalChangeCus, setIsShowModalChangeCus] = useState<boolean>(false);
    const [isShowModalThanhToan, setIsShowModalThanhToan] = useState<boolean>(false);
    const [trangThaiHD, setTrangThaiHD] = useState<{
        trangThai: number;
        txtTrangThai: string;
    }>({ trangThai: TrangThaiHoaDon.HOAN_THANH, txtTrangThai: '' });
    const [customer, setCustomer] = useState<{
        id: string;
        maKhachHang: string;
        tenKhachHang: string;
        soDienThoai: string;
    }>({ id: '', maKhachHang: '', tenKhachHang: '', soDienThoai: '' });

    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1, // 1.remove customer, 2.change tabhoadon
        mes: ''
    });

    const getLoaiHoaDon = (value: number): string => {
        switch (value) {
            case LoaiChungTu.HOA_DON_BAN_LE:
                return 'hóa đơn';
            case LoaiChungTu.GOI_DICH_VU:
                return 'gói dịch vụ';
            case LoaiChungTu.THE_GIA_TRI:
                return 'thẻ giá trị';
            case LoaiChungTu.NHAP_HANG:
                return 'phiếu nhập hàng';
            default:
                return 'khác';
        }
    };

    const sLoaiHoaDon = getLoaiHoaDon(itemHD?.idLoaiChungTu ?? 0);

    const [roleEditInvoice, setRoleEditInvoice] = useState(false);
    const [roleDeleteInvoice, setRoleDeleteInvoice] = useState(false);
    const [rolePrintInvoice, setRolePrintInvoice] = useState(false);
    const CheckRole_byLoaiChungTu = () => {
        switch (itemHD?.idLoaiChungTu ?? 0) {
            case LoaiChungTu.HOA_DON_BAN_LE:
                {
                    setRoleEditInvoice(abpCustom.isGrandPermission('Pages.HoaDon.Edit'));
                    setRoleDeleteInvoice(abpCustom.isGrandPermission('Pages.HoaDon.Delete'));
                    setRolePrintInvoice(abpCustom.isGrandPermission('Pages.HoaDon.Print'));
                }
                break;
            case LoaiChungTu.GOI_DICH_VU:
                {
                    setRoleEditInvoice(abpCustom.isGrandPermission('Pages.GoiDichVu.Edit'));
                    setRoleDeleteInvoice(abpCustom.isGrandPermission('Pages.GoiDichVu.Delete'));
                    setRolePrintInvoice(abpCustom.isGrandPermission('Pages.GoiDichVu.Print'));
                }
                break;
            case LoaiChungTu.THE_GIA_TRI:
                {
                    setRoleEditInvoice(abpCustom.isGrandPermission('Pages.TheGiaTri.Edit'));
                    setRoleDeleteInvoice(abpCustom.isGrandPermission('Pages.TheGiaTri.Delete'));
                    setRolePrintInvoice(abpCustom.isGrandPermission('Pages.TheGiaTri.Print'));
                }
                break;
        }
    };

    useEffect(() => {
        CheckRole_byLoaiChungTu();
    }, [itemHD?.idLoaiChungTu ?? 0]);

    useEffect(() => {
        setNgayLapHoaDon(itemHD?.ngayLapHoaDon ?? '');
        setMaHoaDon(itemHD?.maHoaDon ?? '');
        setGhiChuHD(itemHD?.ghiChuHD ?? '');
        setTongThanhToan(itemHD?.tongThanhToan ?? 0);
        setDaThanhToan(itemHD?.daThanhToan ?? 0);
        setConNo(itemHD?.conNo ?? 0);
        setTrangThaiHD({
            ...trangThaiHD,
            trangThai: itemHD?.trangThai ?? TrangThaiHoaDon.HOAN_THANH,
            txtTrangThai: itemHD?.txtTrangThaiHD ?? ''
        });
        setCustomer({
            ...customer,
            id: itemHD?.idKhachHang ?? Guid.EMPTY,
            maKhachHang: itemHD?.maKhachHang ?? '',
            tenKhachHang: itemHD?.tenKhachHang ?? '',
            soDienThoai: itemHD?.soDienThoai ?? ''
        });
    }, [itemHD?.id]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        setTongThanhToan(tongThanhToanNew);
        let conno = tongThanhToanNew - (itemHD?.daThanhToan ?? 0);
        conno = conno > 0 ? conno : 0;
        setConNo(conno);
    }, [tongThanhToanNew]);

    const changeNgayLapHD = (dt: string) => {
        setNgayLapHoaDon(dt);
    };

    const showModalChangeCustomer = () => {
        setIsShowModalChangeCus(true);
    };

    const onChangeCustomer = (typeAction: number, item: PageKhachHangCheckInDto | undefined) => {
        setIsShowModalChangeCus(false);
        setCustomer({
            ...customer,
            id: item?.idKhachHang ?? Guid.EMPTY,
            maKhachHang: item?.maKhachHang ?? '',
            tenKhachHang: item?.tenKhachHang ?? '',
            soDienThoai: item?.soDienThoai ?? ''
        });
    };

    const InHoaDon = async () => {
        if (itemHD) {
            DataMauIn.hoadon = { ...itemHD };
            DataMauIn.hoadon.maHoaDon = maHoaDon;
            DataMauIn.hoadon.ngayLapHoaDon = ngayLapHoaDon;
            DataMauIn.hoadon.ghiChuHD = ghiChuHD;
            const cthd = await HoaDonService.GetChiTietHoaDon_byIdHoaDon(itemHD.id);
            DataMauIn.hoadonChiTiet = [...cthd];
            DataMauIn.khachhang = {
                maKhachHang: customer?.maKhachHang,
                tenKhachHang: customer?.tenKhachHang,
                soDienThoai: customer?.soDienThoai
            } as KhachHangItemDto;
            DataMauIn.chinhanh = { tenChiNhanh: itemHD?.tenChiNhanh } as ChiNhanhDto;
            DataMauIn.congty = appContext.congty;
            DataMauIn.congty.logo = uploadFileService.GoogleApi_NewLink(DataMauIn.congty?.logo);
            const tempMauIn = await MauInServices.GetContentMauInMacDinh(1, itemHD?.idLoaiChungTu ?? 0);
            let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
            newHtml = DataMauIn.replaceChiNhanh(newHtml);
            newHtml = DataMauIn.replaceHoaDon(newHtml);

            if (newHtml.includes('QRCode')) {
                // Nếu mẫu in có mã QR, luôn luôn in ra QRCode mặc định
                let qrCode = '';
                // get default first tknganhang (order by createtime desc)
                const firstAcc = await TaiKhoanNganHangServices.GetDefault_TaiKhoanNganHang(
                    itemHD?.idChiNhanh as undefined
                );
                if (firstAcc !== null) {
                    qrCode = await TaiKhoanNganHangServices.GetQRCode(
                        {
                            tenChuThe: firstAcc.tenChuThe,
                            soTaiKhoan: firstAcc.soTaiKhoan,
                            tenNganHang: firstAcc.tenNganHang,
                            maPinNganHang: firstAcc.maPinNganHang
                        } as TaiKhoanNganHangDto,
                        itemHD?.tongThanhToan
                    );
                }
                newHtml = newHtml.replace('{QRCode}', `<img style="width: 100%" src=${qrCode} />`);
            }
            DataMauIn.Print(newHtml);
        }
    };

    const CheckGDV_DaSuDung = async () => {
        return await HoaDonService.CheckGDV_DaSuDung(itemHD?.id ?? '');
    };

    const onClickHuyHoaDon = async () => {
        switch (itemHD?.idLoaiChungTu ?? 0) {
            case LoaiChungTu.GOI_DICH_VU:
                {
                    const check = await CheckGDV_DaSuDung();
                    if (check) {
                        setObjAlert({
                            ...objAlert,
                            show: true,
                            mes: 'Gói dịch vụ đã được sử dụng. Không thể hủy',
                            type: 2
                        });
                        return;
                    }
                }
                break;
            case LoaiChungTu.THE_GIA_TRI:
                {
                    const check = await HoaDonService.CheckTheGiaTri_DaSuDung(itemHD?.id ?? '');
                    if (check) {
                        setObjAlert({
                            ...objAlert,
                            show: true,
                            mes: 'Thẻ giá trị đã được sử dụng. Không thể hủy',
                            type: 2
                        });
                        return;
                    }
                }
                break;
        }

        setConfirmDialog({
            ...confirmDialog,
            show: true,
            title: 'Xác nhận hủy',
            mes: `Bạn có chắc chắn muốn hủy ${sLoaiHoaDon}  ${maHoaDon}  không?`
        });
    };

    const onAgreeRemoveInvoice = async () => {
        await HoaDonService.DeleteHoaDon(itemHD?.id ?? Guid.EMPTY);
        await SoQuyServices.HuyPhieuThuChi_ofHoaDonLienQuan(itemHD?.id ?? Guid.EMPTY);

        setTrangThaiHD({
            ...trangThaiHD,
            trangThai: TrangThaiHoaDon.HUY,
            txtTrangThai: 'Đã hủy'
        });
        setConfirmDialog({ ...confirmDialog, show: false });
        setObjAlert({ ...objAlert, show: true, mes: `Hủy ${sLoaiHoaDon} thành công` });

        const diary = {
            idChiNhanh: itemHD?.idChiNhanh,
            chucNang: `Danh mục ${sLoaiHoaDon}`,
            noiDung: `Xóa ${sLoaiHoaDon} ${maHoaDon}`,
            noiDungChiTiet: `Xóa ${sLoaiHoaDon} ${itemHD?.maHoaDon} của khách hàng ${itemHD?.tenKhachHang} (${itemHD?.maKhachHang}) `,
            loaiNhatKy: LoaiNhatKyThaoTac.DELETE
        } as CreateNhatKyThaoTacDto;
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const saveDiaryUpdate = async (changeMaHoaDon = false, changeCustomer = false, changeNgayLap = false) => {
        let diaryDetail = '<br /> <b> Thông tin chi tiết </b>';
        if (changeMaHoaDon) {
            diaryDetail += `<br /> Mã ${sLoaiHoaDon} cũ: ${itemHD?.maHoaDon}`;
            diaryDetail += `<br /> Mã ${sLoaiHoaDon} mới: ${maHoaDon}`;
        }
        if (changeCustomer) {
            diaryDetail += `<br /> Khách hàng cũ: ${itemHD?.tenKhachHang} (${itemHD?.maKhachHang})`;
            diaryDetail += `<br /> Khách hàng mới: ${customer?.tenKhachHang} (${customer?.maKhachHang})`;
        }
        if (changeNgayLap) {
            diaryDetail += `<br /> Ngày lập cũ: ${format(new Date(itemHD?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy')})`;
            diaryDetail += `<br /> Ngày lập mới: ${format(new Date(ngayLapHoaDon ?? ''), 'dd/MM/yyyy')}`;
        }

        const diary: CreateNhatKyThaoTacDto = {
            idChiNhanh: chinhanh.id,
            loaiNhatKy: LoaiNhatKyThaoTac.UPDATE,
            chucNang: `Danh sách ${sLoaiHoaDon}`,
            noiDung: `Cập nhật ${sLoaiHoaDon} ${itemHD?.maHoaDon}`,
            noiDungChiTiet: `${diaryDetail}`
        };
        await nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const updateInvoice = async () => {
        let changeMaHoaDon = false,
            changeNgayLap = false,
            changeCustomer = false,
            changeGhiChu = false;
        if ((itemHD?.maHoaDon ?? '') != maHoaDon) {
            changeMaHoaDon = true;
        }
        if (
            format(new Date(itemHD?.ngayLapHoaDon ?? ''), 'yyyy-MM-dd') !==
            format(new Date(ngayLapHoaDon), 'yyyy-MM-dd')
        ) {
            changeNgayLap = true;
        }
        if ((itemHD?.idKhachHang ?? Guid.EMPTY) != customer.id) {
            changeCustomer = true;
        }
        if ((itemHD?.ghiChuHD ?? '') != ghiChuHD) {
            changeGhiChu = true;
        }

        if (changeMaHoaDon || changeNgayLap || changeCustomer || changeGhiChu) {
            const hdUpdate = { ...itemHD };
            hdUpdate.maHoaDon = maHoaDon;
            hdUpdate.ngayLapHoaDon = ngayLapHoaDon;
            hdUpdate.ghiChuHD = ghiChuHD;
            hdUpdate.idKhachHang = customer.id;
            await HoaDonService.Update_InforHoaDon(hdUpdate);

            if (changeCustomer) {
                await SoQuyServices.UpdateCustomer_toQuyChiTiet(itemHD?.id ?? Guid.EMPTY, customer?.id ?? Guid.EMPTY);
            }
            if (changeNgayLap) {
                await SoQuyServices.UpdateNgayLapQuyHD_ifChangeNgayLapHD(itemHD?.id ?? Guid.EMPTY, ngayLapHoaDon);
            }

            await saveDiaryUpdate(changeMaHoaDon, changeCustomer, changeNgayLap);
        }
        setObjAlert({ ...objAlert, show: true, mes: `Cập nhật ${sLoaiHoaDon} thành công` });
    };

    const savePhieuThuOK = (tongTienThu: number) => {
        setDaThanhToan(daThanhToan + tongTienThu);
        setConNo(tongThanhToan - daThanhToan - tongTienThu);
        setIsShowModalThanhToan(false);
        setObjAlert({ ...objAlert, show: true, mes: `Thanh toán hóa đơn thành công` });
    };
    return (
        <>
            <ModalAddCustomerCheckIn
                typeForm={0}
                isNew={false}
                isShowModal={isShowModalChangeCus}
                onOK={onChangeCustomer}
                onClose={() => setIsShowModalChangeCus(false)}
            />
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onAgreeRemoveInvoice}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <Dialog open={isShowModalThanhToan} onClose={() => setIsShowModalThanhToan(false)} maxWidth="md">
                <PaymentsForm
                    formNumber={FormNumber.OTHER}
                    tongPhaiTra={conNo}
                    inforHD={{
                        id: itemHD?.id ?? '',
                        maHoaDon: itemHD?.maHoaDon ?? '',
                        idKhachHang: itemHD?.idKhachHang ?? '',
                        idChiNhanh: chinhanh?.id ?? '',
                        tenKhachHang: itemHD?.tenKhachHang ?? ''
                    }}
                    onClose={() => setIsShowModalThanhToan(false)}
                    onSaveOKQuyHD={savePhieuThuOK}
                />
            </Dialog>

            <Stack
                className="page-full"
                position={'relative'}
                sx={{ border: '1px solid rgba(204, 204, 204, 0.8)', borderRadius: '4px' }}>
                <Stack
                    padding={1}
                    position={'relative'}
                    sx={{
                        backgroundColor: 'rgb(245 241 241)',
                        borderBottom: '1px solid rgba(204, 204, 204, 0.8)'
                    }}>
                    <Typography fontSize={'20px'} fontWeight={600}>
                        Thông tin {sLoaiHoaDon}
                    </Typography>
                    <Stack
                        direction={'row'}
                        spacing={1}
                        sx={{ position: 'absolute', top: 8, right: 8, color: '#47e7e' }}>
                        <MoreHorizIcon titleAccess="Thao tác khác" />
                        <PrintIcon
                            titleAccess="In hóa đơn"
                            className="only-icon"
                            onClick={InHoaDon}
                            sx={{
                                display: rolePrintInvoice ? '' : 'none'
                            }}
                        />
                    </Stack>
                </Stack>

                <Stack padding={2} overflow={'auto'} paddingBottom={7}>
                    <Stack spacing={3} marginBottom={4}>
                        <Stack padding={3} sx={{ backgroundColor: ' var(--color-bg)', borderRadius: '4px' }}>
                            <Stack spacing={2}>
                                <Stack direction={'row'} alignItems={'end'}>
                                    <Stack flex={1}>
                                        <Typography variant="body2">Mã hóa đơn</Typography>
                                    </Stack>
                                    <Stack flex={2}>
                                        <TextField
                                            size="small"
                                            variant="standard"
                                            sx={{
                                                ' & input': {
                                                    fontWeight: 500,
                                                    fontSize: '18px'
                                                }
                                            }}
                                            value={maHoaDon}
                                            onChange={(e) => setMaHoaDon(e.target.value)}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'} alignItems={'end'}>
                                    <Stack flex={1}>
                                        <Typography variant="body2">Ngày lập</Typography>
                                    </Stack>
                                    <Stack flex={2}>
                                        <DatePickerCustom
                                            variant="standard"
                                            defaultVal={ngayLapHoaDon}
                                            handleChangeDate={changeNgayLapHD}
                                        />
                                    </Stack>
                                </Stack>

                                <Stack direction={'row'} alignItems={'center'}>
                                    <Typography variant="body2" flex={1}>
                                        Khách hàng
                                    </Typography>
                                    <Stack direction={'column'} spacing={1} flex={2}>
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <Typography fontWeight={500}>{customer.tenKhachHang}</Typography>
                                            <EditOutlinedIcon
                                                titleAccess="Thay đổi khách hàng"
                                                className="only-icon"
                                                sx={{
                                                    display: roleEditInvoice ? '' : 'none'
                                                }}
                                                onClick={showModalChangeCustomer}
                                            />
                                        </Stack>

                                        <Typography variant="body2" color={'var( --color-text-blur)'}>
                                            {customer?.soDienThoai}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack spacing={1.5}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2" flex={1} fontWeight={500} fontSize={18}>
                                    Tổng phải trả
                                </Typography>
                                <Typography flex={1} fontWeight={500} fontSize={'18px'}>
                                    {new Intl.NumberFormat('vi-VN').format(tongThanhToan ?? 0)}
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2" flex={1}>
                                    Đã thanh toán
                                </Typography>
                                <Typography flex={1} fontWeight={500}>
                                    {new Intl.NumberFormat('vi-VN').format(daThanhToan ?? 0)}
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2" flex={1} fontWeight={500}>
                                    Còn nợ
                                </Typography>
                                <Typography flex={1} fontWeight={500}>
                                    {new Intl.NumberFormat('vi-VN').format(conNo ?? 0)}
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2" flex={1}>
                                    Chi nhánh bán
                                </Typography>
                                <Typography flex={1}> {itemHD?.tenChiNhanh}</Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2" flex={1}>
                                    Trạng thái
                                </Typography>
                                <Typography
                                    flex={1}
                                    className={
                                        trangThaiHD?.trangThai === TrangThaiHoaDon.HOAN_THANH
                                            ? 'data-grid-cell-trangthai-active'
                                            : 'data-grid-cell-trangthai-notActive'
                                    }>
                                    {trangThaiHD?.txtTrangThai}
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography variant="body2" flex={1}>
                                    User lập phiếu
                                </Typography>
                                <Typography flex={1}> {itemHD?.userName}</Typography>
                            </Stack>
                            <TextField
                                placeholder="Ghi chú"
                                variant="standard"
                                value={ghiChuHD}
                                onChange={(e) => setGhiChuHD(e.target.value)}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Stack position={'absolute'} bottom={0} sx={{ backgroundColor: 'white' }} width={'100%'}>
                    <Stack
                        direction={{ lg: 'row', md: 'row', sm: 'column', xs: 'column' }}
                        spacing={1}
                        alignItems={'center'}
                        padding={2}
                        justifyContent={'center'}>
                        {conNo > 0 && abpCustom.isGrandPermission('Pages.QuyHoaDon.ThanhToanCongNoHoaDon') && (
                            <Button
                                variant="outlined"
                                sx={{ flex: 2 }}
                                fullWidth
                                startIcon={<AttachMoneyIcon />}
                                onClick={() => setIsShowModalThanhToan(true)}>
                                Thanh toán
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{
                                flex: 1,
                                display: roleDeleteInvoice ? '' : 'none'
                            }}
                            startIcon={<DeleteIcon />}
                            onClick={onClickHuyHoaDon}>
                            Hủy
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                flex: 1,
                                display: roleEditInvoice ? '' : 'none'
                            }}
                            startIcon={<SaveIcon />}
                            onClick={updateInvoice}>
                            Lưu
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};
export default TabThongTinHoaDon;
