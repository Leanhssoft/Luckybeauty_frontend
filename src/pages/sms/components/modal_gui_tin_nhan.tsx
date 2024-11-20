import { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import {
    CreateOrEditSMSDto,
    CustomerSMSDto,
    ESMSDto,
    NhatKyGuiTinSMSDto,
    ParamSearchSMS
} from '../../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import utils from '../../../utils/utils';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Button,
    TextField,
    Stack,
    Typography
} from '@mui/material';
import DialogButtonClose from '../../../components/Dialog/ButtonClose';
import SelectWithData from '../../../components/Select/SelectWithData';
import AppConsts, { DateType, ISelect, LoaiTin, SMS_HinhThucGuiTin, TrangThaiSMS } from '../../../lib/appconst';
import { IDataAutocomplete } from '../../../services/dto/IDataAutocomplete';
import AutocompleteWithData from '../../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import HeThongSMSServices from '../../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import LichSuNap_ChuyenTienService from '../../../services/sms/lich_su_nap_tien/LichSuNap_ChuyenTienService';
import MauTinSMSService from '../../../services/sms/mau_tin_sms/MauTinSMSService';
import { BrandnameDto, IParamSearchBrandname } from '../../../services/sms/brandname/BrandnameDto';
import BrandnameService from '../../../services/sms/brandname/BrandnameService';
import Cookies from 'js-cookie';
import { IPropModal } from '../../../services/dto/IPropsComponent';
import Zalo_MultipleAutoComplete_WithSDT, {
    IPropsZalo_AutocompleteMultipleCustomer
} from '../../../components/Autocomplete/Zalo_MultipleAutoComplete_WithSDT';
import CaiDatNhacNhoService from '../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';

export interface IPropModalSMS extends IPropModal<CreateOrEditSMSDto> {
    idLoaiTin?: number;
    arrIdCustomerChosed?: string[];
    arrIdBookingChosed?: string[];
    arrIdHoaDonChosed?: string[];
}

export default function ModalGuiTinNhan(props: IPropModalSMS) {
    const { isShowModal, idLoaiTin, arrIdCustomerChosed, idUpdate, onClose, onOK } = props;
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [lstCustomerChosed, setLstCustomerChosed] = useState<CustomerSMSDto[]>([]);

    const [txtFromTo, setTextFromTo] = useState('');
    const [lblLoaiKhach, setLblLoaiKhach] = useState(`Khách sinh nhật`);
    const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dateType, setDateType] = useState<string>(DateType.HOM_NAY);
    const [dateTypeText, setDateTypeText] = useState<string>('Hôm nay');
    const [soduTaiKhoan, setSoDuTaiKhoan] = useState(0);
    const [lstAllMauTinSMS, setLstAllMauTinSMS] = useState<MauTinSMSDto[]>([]);
    const [lstBrandname, setLstBrandname] = useState<BrandnameDto[]>([]);

    useEffect(() => {
        if (isShowModal) {
            if (utils.checkNull(idUpdate)) {
                setNewSMS({ ...newSMS, id: '', idLoaiTin: idLoaiTin ?? 1, soTinGui: 0 });
            } else {
                // get data from db
            }
        }
        PageLoad();
    }, [isShowModal]);

    const PageLoad = async () => {
        await GetAllMauTinSMS();
        await GetListBrandname();
        await GetBrandnameBalance_byUserLogin();
    };

    const GetBrandnameBalance_byUserLogin = async () => {
        const data = await LichSuNap_ChuyenTienService.GetBrandnameBalance_byUserLogin();
        if (data != null) {
            setSoDuTaiKhoan(data);
        }
    };

    const GetListBrandname = async () => {
        let tenantId = parseInt(Cookies.get('Abp.TenantId') ?? '1') ?? 1;
        tenantId = isNaN(tenantId) ? 1 : tenantId;
        const param = {
            keyword: ''
        } as IParamSearchBrandname;
        const data = await BrandnameService.GetListBandname(param, tenantId);
        if (data !== null) {
            // HOST: đang get all brandname, nên nếu gửi SMS từ HOST thì filter
            const arrByTenantId = data.items?.filter((x) => x.tenantId == tenantId);
            setLstBrandname(arrByTenantId);
        }
    };

    const GetAllMauTinSMS = async () => {
        const data = await MauTinSMSService.GetAllMauTinSMS();
        if (data !== null) {
            setLstAllMauTinSMS(data);
        }
    };

    const choseCustomer = (lstCustomer: CustomerSMSDto[]) => {
        setLstCustomerChosed(lstCustomer);
    };

    const propsDataCustomerZalo: IPropsZalo_AutocompleteMultipleCustomer = {
        paramFilter: {
            idLoaiTin: newSMS.idLoaiTin,
            IdChiNhanhs: [idChiNhanh],
            fromDate: fromDate,
            toDate: toDate,
            hinhThucGuiTins: [SMS_HinhThucGuiTin.SMS],
            // nếu gửi tin từ mẫu tin của PM (không phải ZNS) ---> chỉ lấy khách có tài khoản zoaId (2)
            loaiUser_CoTheGuiTin: 0
        } as ParamSearchSMS,
        arrIdChosed: arrIdCustomerChosed,
        handleChoseItem: choseCustomer
    };
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);

    useEffect(() => {
        onApplyFilterDate(fromDate, toDate, dateType, dateTypeText);
        setLstCustomerChosed([]);
        switch (newSMS?.idLoaiTin) {
            case LoaiTin.TIN_SINH_NHAT:
                setLblLoaiKhach('Khách sinh nhật');
                break;
            case LoaiTin.TIN_GIAO_DICH:
                setLblLoaiKhach('Khách giao dịch');
                break;
            case LoaiTin.TIN_LICH_HEN:
                setLblLoaiKhach('Khách có hẹn');
                break;
            case LoaiTin.TIN_THUONG:
                setLblLoaiKhach('');
                break;
        }
    }, [newSMS?.idLoaiTin]);

    const isDateFuture = newSMS?.idLoaiTin === LoaiTin.TIN_LICH_HEN || newSMS?.idLoaiTin === LoaiTin.TIN_SINH_NHAT;

    const onApplyFilterDate = (fromDate: string, toDate: string, dateType: string, dateTypeText = '') => {
        setAnchorDateEl(null);
        setFromDate(fromDate);
        setToDate(toDate);
        setDateType(dateType);
        setDateTypeText(dateTypeText);

        switch (newSMS?.idLoaiTin) {
            case LoaiTin.TIN_SINH_NHAT:
                {
                    switch (dateType) {
                        case DateType.HOM_NAY:
                        case DateType.HOM_QUA:
                        case DateType.NGAY_MAI:
                            {
                                const txtNgayThang = format(new Date(fromDate), 'dd/MM');
                                setTextFromTo(`${dateTypeText} (${txtNgayThang})`);
                            }
                            break;
                        case DateType.TUAN_NAY:
                        case DateType.TUAN_TRUOC:
                        case DateType.TUAN_TOI:
                        case DateType.TUY_CHON:
                            {
                                const txtFrom = format(new Date(fromDate), 'dd/MM');
                                const txtTo = format(new Date(toDate), 'dd/MM');
                                setTextFromTo(`${dateTypeText} (${txtFrom} đến ${txtTo})`);
                            }
                            break;
                        case DateType.THANG_NAY:
                        case DateType.THANG_TRUOC:
                        case DateType.THANG_TOI:
                            {
                                const txtMonth = format(new Date(fromDate), 'MM');
                                setTextFromTo(`Tháng ${txtMonth}`);
                            }
                            break;
                        case DateType.QUY_NAY:
                        case DateType.QUY_TRUOC:
                            {
                                const txtMonthFrom = format(new Date(fromDate), 'MM');
                                const txtMonthTo = format(new Date(toDate), 'MM');
                                setTextFromTo(`Tháng ${txtMonthFrom} - Tháng ${txtMonthTo}`);
                            }
                            break;
                        case DateType.NAM_NAY:
                        case DateType.NAM_TRUOC:
                            {
                                const txtYear = format(new Date(fromDate), 'yyyy');
                                setTextFromTo('Năm '.concat(txtYear));
                            }
                            break;
                        case DateType.TAT_CA:
                            {
                                setTextFromTo(`${dateTypeText}`);
                            }
                            break;
                    }
                }
                break;
            case LoaiTin.TIN_GIAO_DICH:
            case LoaiTin.TIN_LICH_HEN:
                {
                    switch (dateType) {
                        case DateType.HOM_NAY:
                        case DateType.HOM_QUA:
                        case DateType.NGAY_MAI:
                            {
                                const txtNgayThang = format(new Date(fromDate), 'dd/MM/yyyy');
                                setTextFromTo(`${txtNgayThang}`);
                            }
                            break;
                        case DateType.TUAN_NAY:
                        case DateType.TUAN_TRUOC:
                        case DateType.TUAN_TOI:
                        case DateType.TUY_CHON:
                            {
                                const txtFrom = format(new Date(fromDate), 'dd/MM/yyyy');
                                const txtTo = format(new Date(toDate), 'dd/MM/yyyy');
                                setTextFromTo(`${txtFrom} đến ${txtTo}`);
                            }
                            break;
                        case DateType.THANG_NAY:
                        case DateType.THANG_TRUOC:
                        case DateType.THANG_TOI:
                            {
                                const txtMonth = format(new Date(fromDate), 'MM/yyyy');
                                setTextFromTo(`Tháng ${txtMonth}`);
                            }
                            break;
                        case DateType.QUY_NAY:
                        case DateType.QUY_TRUOC:
                            {
                                const txtMonthFrom = format(new Date(fromDate), 'MM/yyyy');
                                const txtMonthTo = format(new Date(toDate), 'MM/yyyy');
                                setTextFromTo(`Tháng ${txtMonthFrom} - Tháng ${txtMonthTo}`);
                            }
                            break;
                        case DateType.NAM_NAY:
                        case DateType.NAM_TRUOC:
                            {
                                const txtYear = format(new Date(fromDate), 'yyyy');
                                setTextFromTo('Năm '.concat(txtYear));
                            }
                            break;
                        case DateType.TAT_CA:
                            {
                                setTextFromTo(`${dateTypeText}`);
                            }
                            break;
                    }
                }
                break;
            default:
                setTextFromTo('');
                break;
        }
    };

    const checkSave = async (): Promise<boolean> => {
        if (lstBrandname?.length === 0) {
            setObjAlert({ ...objAlert, show: true, type: 2, mes: 'Chưa đăng ký brandname' });
            return false;
        }
        if (utils.checkNull(newSMS.noiDungTin)) {
            setObjAlert({ ...objAlert, show: true, type: 2, mes: 'Vui lòng nhập nội dung tin nhắn' });
            return false;
        }
        if ((lstCustomerChosed?.length ?? 0) == 0) {
            setObjAlert({ ...objAlert, show: true, type: 2, mes: 'Vui lòng chọn khách hàng' });
            return false;
        }
        return true;
    };

    const saveDraft = async () => {
        const noiDungTin = newSMS.noiDungTin;
        // lưu nháp: không bắt buộc chọn khách hàng
        if (lstCustomerChosed.length > 0) {
            for (let i = 0; i < lstCustomerChosed.length; i++) {
                const itFor = lstCustomerChosed[i];
                CaiDatNhacNhoService.objSMS = itFor;
                const objSMS = new CreateOrEditSMSDto({
                    idLoaiTin: newSMS?.idLoaiTin,
                    idChiNhanh: idChiNhanh,
                    idKhachHang: itFor.idKhachHang,
                    noiDungTin: CaiDatNhacNhoService.ReplaceBienSMS(noiDungTin),
                    soTinGui: 0,
                    soDienThoai: itFor.soDienThoai
                });
                objSMS.trangThai = TrangThaiSMS.DRAFT;
                objSMS.giaTienMoiTinNhan = 950;
                objSMS.idHoaDon = itFor?.idHoaDon;
                objSMS.idBooking = itFor?.idBooking;
                objSMS.idBooking = itFor?.idBooking;
                const htSMS = await HeThongSMSServices.Insert_HeThongSMS(objSMS);
                objSMS.id = htSMS?.id;
                await saveNhatKyGuiTin(objSMS);
            }
        } else {
            // only save hethong sms
            const objSMS = new CreateOrEditSMSDto({
                idLoaiTin: newSMS?.idLoaiTin,
                idChiNhanh: idChiNhanh,
                noiDungTin: noiDungTin,
                soTinGui: 0,
                soDienThoai: ''
            });
            objSMS.trangThai = TrangThaiSMS.DRAFT;
            await HeThongSMSServices.Insert_HeThongSMS(objSMS);
        }
        setObjAlert({ ...objAlert, show: true, type: 1, mes: 'Lưu nháp thành công' });
        onOK(1);
    };

    const saveSMS = async () => {
        const check = await checkSave();
        if (!check) {
            return;
        }
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        if (lstBrandname.length > 0) {
            const tenBranname = lstBrandname[0].brandname;
            const noiDungTin = newSMS.noiDungTin;
            // only get customer has phone
            const lstCusHasPhone = lstCustomerChosed?.filter((x: CustomerSMSDto) => !utils.checkNull(x.soDienThoai));
            for (let i = 0; i < lstCusHasPhone.length; i++) {
                const itFor = lstCusHasPhone[i];
                CaiDatNhacNhoService.objSMS = itFor;
                const objEsms = new ESMSDto({
                    sdtKhachhang: itFor.soDienThoai,
                    tenBranname: tenBranname,
                    noiDungTin: CaiDatNhacNhoService.ReplaceBienSMS(noiDungTin)
                });
                const sendSMS = await HeThongSMSServices.SendSMS_Json(objEsms);

                const objSMS = new CreateOrEditSMSDto({
                    idLoaiTin: newSMS?.idLoaiTin,
                    idChiNhanh: idChiNhanh,
                    idKhachHang: itFor.idKhachHang,
                    noiDungTin: objEsms.content ?? '',
                    soTinGui: Math.ceil(noiDungTin?.length / 160),
                    soDienThoai: itFor.soDienThoai
                });
                objSMS.giaTienMoiTinNhan = 950;
                objSMS.idTinNhan = sendSMS.messageId;
                objSMS.trangThai = sendSMS.messageStatus;
                objSMS.tenKhachHang = itFor.tenKhachHang ?? '';
                objSMS.idHoaDon = itFor?.idHoaDon;
                objSMS.idBooking = itFor?.idBooking;

                const loaiTin = AppConsts.smsLoaiTin.filter((x: ISelect) => x.value == objSMS?.idLoaiTin);
                objSMS.loaiTinNhan = loaiTin.length > 0 ? loaiTin[0].text : '';

                const trangThaiTin = AppConsts.ListTrangThaiGuiTin.filter(
                    (x: ISelect) => x.value == sendSMS?.messageStatus
                );
                objSMS.sTrangThaiGuiTinNhan = trangThaiTin.length > 0 ? trangThaiTin[0].text : '';

                const htSMS = await HeThongSMSServices.Insert_HeThongSMS(objSMS);
                objSMS.id = htSMS?.id;
                await saveNhatKyGuiTin(objSMS);

                switch (sendSMS.messageStatus) {
                    case TrangThaiSMS.SUCCESS:
                        {
                            setObjAlert({ ...objAlert, show: true, mes: 'Gửi tin thành công', type: 1 });
                        }
                        break;
                    default:
                        {
                            const typeMes = AppConsts.ListTrangThaiGuiTin.filter(
                                (x) => x.value == sendSMS.messageStatus
                            );
                            if (typeMes.length > 0) {
                                setObjAlert({ mes: `Gửi tin thất bại. ${typeMes[0].text}`, show: true, type: 2 });
                            }
                        }
                        break;
                }
                onOK(1);
            }
        }
    };
    const saveNhatKyGuiTin = async (objSMS: CreateOrEditSMSDto) => {
        const nkyGuiTin = new NhatKyGuiTinSMSDto({
            idHeThongSMS: objSMS?.id,
            idKhachHang: objSMS?.idKhachHang,
            idChiNhanh: idChiNhanh,
            idLoaiTin: objSMS?.idLoaiTin,
            thoiGianTu: fromDate,
            thoiGianDen: toDate
        });

        if (arrIdCustomerChosed?.length ?? 0 > 0) {
            switch (idLoaiTin ?? LoaiTin.TIN_THUONG) {
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        // get list hoadon by arrId
                        // nkyGuiTin.idHoaDon = idHoaDon;
                        // nkyGuiTin.idBooking = idBooking;
                        // nkyGuiTin.thoiGianTu = from;
                        // nkyGuiTin.thoiGianDen = to;
                        // await HeThongSMSServices.ThemMoi_NhatKyGuiTinSMS(nkyGuiTin);
                    }
                    break;
                case LoaiTin.TIN_LICH_HEN:
                    {
                        // get list hoadon by arrId
                        // nkyGuiTin.idHoaDon = idHoaDon;
                        // nkyGuiTin.idBooking = idBooking;
                        // nkyGuiTin.thoiGianTu = from;
                        // nkyGuiTin.thoiGianDen = to;
                        // await HeThongSMSServices.ThemMoi_NhatKyGuiTinSMS(nkyGuiTin);
                    }
                    break;
            }
        } else {
            nkyGuiTin.idHoaDon = objSMS?.idHoaDon ?? null;
            nkyGuiTin.idBooking = objSMS?.idBooking ?? null;
            await HeThongSMSServices.ThemMoi_NhatKyGuiTinSMS(nkyGuiTin);
        }
    };
    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={isShowModal} onClose={onClose} aria-labelledby="draggable-dialog-title" maxWidth="sm">
                <DialogTitle className="modal-title" id="draggable-dialog-title">
                    {utils.checkNull(idUpdate) ? 'Thêm mới' : 'Cập nhật'} SMS
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />
                <DialogContent sx={{ overflow: 'unset' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <SelectWithData
                                label="Brandname"
                                data={lstBrandname?.map((x) => {
                                    return {
                                        value: x.id as string,
                                        text: x.brandname
                                    } as ISelect;
                                })}
                                idChosed={lstBrandname.length > 0 ? lstBrandname[0].id : ''}
                                handleChange={(item: ISelect) =>
                                    setNewSMS({ ...newSMS, idBrandname: item?.value as string })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectWithData
                                label="Loại tin"
                                data={AppConsts.smsLoaiTin}
                                idChosed={newSMS.idLoaiTin}
                                handleChange={(item: ISelect) => {
                                    // set default mautin macdinh
                                    const maumacdinh = lstAllMauTinSMS?.filter(
                                        (x: MauTinSMSDto) => x.idLoaiTin === item.value && x.laMacDinh
                                    );
                                    if (maumacdinh.length > 0) {
                                        setNewSMS({
                                            ...newSMS,
                                            idLoaiTin: item.value as number,
                                            idMauTin: maumacdinh[0].id,
                                            noiDungTin: maumacdinh[0].noiDungTinMau ?? ''
                                        });
                                    } else {
                                        setNewSMS({ ...newSMS, idLoaiTin: item.value as number, idMauTin: null });
                                    }
                                }}
                            />
                        </Grid>

                        {newSMS?.idLoaiTin !== LoaiTin.TIN_THUONG && (
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack spacing={2}>
                                    <TextField
                                        size="small"
                                        label={lblLoaiKhach}
                                        value={txtFromTo}
                                        onClick={(event) => setAnchorDateEl(event.currentTarget)}
                                    />
                                    <DateFilterCustom
                                        id="popover-date-filter"
                                        isFuture={isDateFuture}
                                        dateTypeDefault={DateType.HOM_NAY}
                                        open={openDateFilter}
                                        anchorEl={anchorDateEl}
                                        onClose={() => setAnchorDateEl(null)}
                                        onApplyDate={onApplyFilterDate}
                                    />
                                </Stack>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Zalo_MultipleAutoComplete_WithSDT {...propsDataCustomerZalo} />
                        </Grid>
                        <Grid item xs={12}>
                            <AutocompleteWithData
                                label="Mẫu tin"
                                idChosed={newSMS?.idMauTin ?? ''}
                                lstData={lstAllMauTinSMS
                                    ?.filter((x: MauTinSMSDto) => x.idLoaiTin === newSMS?.idLoaiTin)
                                    .map((x: MauTinSMSDto) => {
                                        return { id: x.id, text1: x.tenMauTin, text2: x.noiDungTinMau };
                                    })}
                                handleChoseItem={(item: IDataAutocomplete) => {
                                    setNewSMS({
                                        ...newSMS,
                                        idMauTin: item?.id as string,
                                        noiDungTin: item?.text2 ?? ''
                                    });
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack spacing={1}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    name="noiDungTin"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label={`Nội dung tin`}
                                    onChange={(e) => {
                                        setNewSMS({
                                            ...newSMS,
                                            soTinGui: Math.ceil(e.target.value?.length / 160),
                                            noiDungTin: e.target.value
                                        });
                                    }}
                                    value={newSMS?.noiDungTin}
                                />
                                <Stack justifyContent={'space-between'} direction={'row'}>
                                    <Typography
                                        variant="caption"
                                        color={
                                            '#9b9090'
                                        }>{`${newSMS?.noiDungTin?.length}/160 (${newSMS?.soTinGui} tin nhắn)`}</Typography>
                                    <Typography fontSize={'14px'}>
                                        {new Intl.NumberFormat('vi-VN').format(soduTaiKhoan)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ paddingBottom: '20px' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: 'var(--color-main)'
                        }}
                        onClick={onClose}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                    {isSubmitting ? (
                        <Button variant="contained">Đang lưu</Button>
                    ) : (
                        <>
                            <Button variant="contained" onClick={saveDraft}>
                                Lưu nháp
                            </Button>
                            <Button variant="contained" type="submit" onClick={saveSMS}>
                                Lưu
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
