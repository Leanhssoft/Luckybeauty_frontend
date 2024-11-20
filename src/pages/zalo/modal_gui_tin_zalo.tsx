import { useContext, useEffect, useState } from 'react';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import {
    CreateOrEditSMSDto,
    CustomerSMSDto,
    NhatKyGuiTinSMSDto,
    ParamSearchSMS
} from '../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import utils from '../../utils/utils';
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
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import DialogButtonClose from '../../components/Dialog/ButtonClose';
import SelectWithData from '../../components/Select/SelectWithData';
import AppConsts, {
    DateType,
    ISelect,
    LoaiTin,
    SMS_HinhThucGuiTin,
    TrangThaiGuiTinZalo,
    TypeAction
} from '../../lib/appconst';
import AutocompleteWithData from '../../components/Autocomplete/AutocompleteWithData';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import { format } from 'date-fns';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { ITemplateZNS, IZaloDataMessage, IZaloResultMessage, InforZOA } from '../../services/zalo/zalo_dto';
import ZaloService from '../../services/zalo/ZaloService';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { Guid } from 'guid-typescript';
import Zalo_MultipleAutoComplete_WithSDT, {
    IPropsZalo_AutocompleteMultipleCustomer
} from '../../components/Autocomplete/Zalo_MultipleAutoComplete_WithSDT';
import { IZaloButtonDetail, IZaloElement, IZaloTableDetail, IZaloTemplate } from '../../services/zalo/ZaloTemplateDto';
import { ZaloConst } from '../../lib/zaloConst';
import { ZaloTemplateView } from './zalo_template_view';
import he_thong_sms_services from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import suggestStore from '../../stores/suggestStore';
import { parseInt } from 'lodash';
import { IPropModalSMS } from '../sms/components/modal_gui_tin_nhan';

export default function ModalGuiTinNhanZalo(props: IPropModalSMS) {
    const { isShowModal, idUpdate, arrIdCustomerChosed, arrIdBookingChosed, arrIdHoaDonChosed, onClose, onOK } = props;
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanh.id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txtFromTo, setTextFromTo] = useState('');
    const [lblLoaiKhach, setLblLoaiKhach] = useState(`Khách sinh nhật`);
    const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dateType, setDateType] = useState<string>(DateType.HOM_NAY);
    const [dateTypeText, setDateTypeText] = useState<string>('Hôm nay');

    const [inforZOA, setInforZOA] = useState<InforZOA>({} as InforZOA);
    const [idMauTinZalo, setIdMauTinZalo] = useState(Guid.EMPTY);
    const [newSMS, setNewSMS] = useState<CreateOrEditSMSDto>(new CreateOrEditSMSDto({}) as CreateOrEditSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [lstCustomerChosed, setLstCustomerChosed] = useState<CustomerSMSDto[]>([]);
    const [allMauTinZalo, setAllMauTinZalo] = useState<IZaloTemplate[]>([]);
    const [itemMauTinZNS, setItemMauTinZNS] = useState<ITemplateZNS>();

    // các thông số: nếu gửi theo mẫu PM (zalo template)
    const [imageUrl, setImageUrl] = useState(''); // url of imge
    const [lstButton, setLstButton] = useState<IZaloButtonDetail[]>([]);
    const [tblDetail, setTblDetail] = useState<IZaloTableDetail[]>([]);
    const [headerElm, setHeaderElm] = useState<IZaloElement | null>();
    const [textElm, setTextElm] = useState<IZaloElement | null>();
    const [zaloTempItem, setZaloTempItem] = useState<IZaloTemplate | null>();
    const [tieuDeMauTinZalo, setTieuDeMauTinZalo] = useState(''); // tiêu đề của mẫu ZNS/ mẫu PM
    const isZNSTemplate = (idMauTinZalo?.length ?? 0) < 36;

    useEffect(() => {
        setIsSubmitting(false);
        if (isShowModal) {
            // mặc định: gửi tin theo mẫu PM (để có thể gửi tin tư vấn cho người dùng tương tác: không qua SĐT)
            setIdMauTinZalo(Guid.EMPTY);
            if (utils.checkNull(idUpdate)) {
                setNewSMS({ ...newSMS, id: '', idLoaiTin: LoaiTin.TIN_THUONG, soTinGui: 0 });
            } else {
                // get data from db
            }
            GetZaloTokenfromDB();
            console.log('into1');
        }
    }, [isShowModal]);

    const GetZaloTokenfromDB = async () => {
        if (suggestStore?.zaloAccessToken !== undefined) {
            await GetInfor_ZaloOfficialAccount(suggestStore?.zaloAccessToken);
            await GetAllMauTinZalo(suggestStore?.zaloAccessToken);
        }
    };

    const GetAllMauTinZalo = async (accessToken: string) => {
        const lstMauTinDB = await ZaloService.GetAllZaloTemplate_fromDB();
        const mauTinZNS = await ZaloService.GetList_TempFromZNS(accessToken, 1);

        let arr2: IZaloTemplate[] = [];
        if (mauTinZNS !== undefined) {
            arr2 = mauTinZNS?.map((x) => {
                return {
                    id: x.templateId.toString(),
                    idLoaiTin: LoaiTin.TIN_THUONG, // nếu mẫu zalo: gán = loại tin thường
                    tenMauTin: x.templateName,
                    isSystem: false // mẫu của zalo
                } as IZaloTemplate;
            });
        }
        const arr1 = lstMauTinDB?.map((x) => {
            return {
                id: x.id,
                idLoaiTin: x.idLoaiTin,
                tenMauTin: x.tenMauTin,
                isSystem: true // mẫu của PM
            } as IZaloTemplate;
        });
        setAllMauTinZalo([...arr1, ...arr2]);
    };

    const GetInfor_ZaloOfficialAccount = async (accessToken: string) => {
        const newOA = await ZaloService.GetInfor_ZaloOfficialAccount(accessToken);
        setInforZOA(newOA);
    };

    const choseCustomer = (lstCustomer: CustomerSMSDto[]) => {
        setLstCustomerChosed(lstCustomer);
        console.log('lstcus ', lstCustomer);
    };

    useEffect(() => {
        setLstCustomerChosed([]);
    }, [newSMS?.idLoaiTin]);

    const propsDataCustomerZalo: IPropsZalo_AutocompleteMultipleCustomer = {
        paramFilter: {
            idLoaiTin: newSMS.idLoaiTin,
            IdChiNhanhs: [idChiNhanh],
            fromDate: fromDate,
            toDate: toDate,
            hinhThucGuiTins: [SMS_HinhThucGuiTin.ZALO],
            // nếu gửi tin từ mẫu tin của PM (không phải ZNS) ---> chỉ lấy khách có tài khoản zoaId (2)
            loaiUser_CoTheGuiTin: newSMS?.idLoaiTin === LoaiTin.TIN_THUONG ? 0 : isZNSTemplate ? 0 : 2
        } as ParamSearchSMS,
        arrIdChosed: arrIdCustomerChosed,
        handleChoseItem: choseCustomer
    };

    const choseMauTinZNS = async (item: IDataAutocomplete) => {
        setIdMauTinZalo(item?.id);

        if (!utils.checkNull(item?.id)) {
            if (item?.id.length < 36) {
                // mẫu ZNS của zalo
                const dataMauTin = await ZaloService.GetZNSTemplate_byId(suggestStore?.zaloAccessToken ?? '', item?.id);
                if (dataMauTin !== null) {
                    setItemMauTinZNS(dataMauTin);
                    setTieuDeMauTinZalo(dataMauTin?.templateName);
                } else {
                    setTieuDeMauTinZalo('');
                }
            } else {
                // zalo template của PM
                const itemDefault = await ZaloService.GetZaloTemplate_byId(item?.id as string);

                if (itemDefault != null && itemDefault != undefined) {
                    setZaloTempItem(itemDefault);

                    if (itemDefault?.elements !== undefined) {
                        const banner = itemDefault?.elements?.filter(
                            (x) => x.elementType === ZaloConst.ElementType.BANNER || ZaloConst.ElementType.IMAGE
                        );
                        if (banner !== undefined && banner.length > 0) {
                            if (banner[0].isImage) {
                                setImageUrl(banner[0].content);
                            } else {
                                setImageUrl('');
                            }
                        } else {
                            setImageUrl('');
                        }
                        const header = itemDefault?.elements?.filter(
                            (x) => x.elementType === ZaloConst.ElementType.HEADER
                        );
                        if (header !== undefined && header.length > 0) {
                            setHeaderElm(header[0]);
                            setTieuDeMauTinZalo(header[0]?.content);
                        } else {
                            setHeaderElm(null);
                            setTieuDeMauTinZalo('');
                        }
                        const text = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.TEXT);
                        if (text !== undefined && text.length > 0) {
                            setTextElm(text[0]);

                            // nếu không có tiêu đề: lấy nội dung
                            if ((header?.length ?? 0) == 0) {
                                setTieuDeMauTinZalo(text[0]?.content);
                            }
                        } else {
                            setTextElm(null);
                        }

                        const tbl = itemDefault?.elements
                            ?.filter((x) => x.elementType === ZaloConst.ElementType.TABLE)
                            ?.map((x) => {
                                return x?.tables;
                            });
                        if (tbl !== undefined && tbl?.length > 0) {
                            setTblDetail(tbl[0]);
                        } else {
                            setTblDetail([]);
                        }
                    }
                    if (itemDefault?.buttons !== undefined) {
                        setLstButton(itemDefault?.buttons);
                    } else {
                        setLstButton([]);
                    }
                } else {
                    setZaloTempItem(null);
                }
            }
        }
    };

    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);
    const isDateFuture = newSMS?.idLoaiTin === LoaiTin.TIN_LICH_HEN || newSMS?.idLoaiTin === LoaiTin.TIN_SINH_NHAT;

    useEffect(() => {
        setLstCustomerChosed([]);
        onApplyFilterDate(fromDate, toDate, dateType, dateTypeText);
    }, [newSMS?.idLoaiTin]);

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
                    // get customer by loaitin
                    // setLstcustomerByLoaiTin(allKhachHangOA.filter((x: IInforUserZOA) => x.birth_date === 1));
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
                {
                    setTextFromTo('');
                }
                break;
        }
    };

    const checkSave = async (): Promise<boolean> => {
        if ((lstCustomerChosed?.length ?? 0) == 0) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng chọn khách hàng để gửi tin', type: 2 });
            return false;
        }
        if ((utils.checkNull(idMauTinZalo) || idMauTinZalo === Guid.EMPTY) && utils.checkNull(newSMS.noiDungTin)) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập nội dung tin nhắn', type: 2 });
            return false;
        }
        return true;
    };

    const saveHeThongSMS = async (cusItem: CustomerSMSDto, dataZalo: IZaloDataMessage, objSMS: CreateOrEditSMSDto) => {
        if (!utils.checkNull(cusItem?.idKhachHang) && cusItem?.idKhachHang !== Guid.EMPTY) {
            const newObj = { ...objSMS };
            newObj.id = Guid.EMPTY;
            newObj.idChiNhanh = idChiNhanh;
            newObj.giaTienMoiTinNhan = parseInt(itemMauTinZNS?.price?.toString() ?? '0');
            newObj.soTinGui = 1;
            newObj.idTinNhan = dataZalo?.message_id;
            newObj.hinhThucGui = SMS_HinhThucGuiTin.ZALO;
            newObj.idKhachHang = cusItem?.idKhachHang as string;
            newObj.soDienThoai = cusItem?.soDienThoai as string;
            newObj.tenKhachHang = cusItem?.tenKhachHang as string;
            newObj.trangThai = TrangThaiGuiTinZalo.SUCCESS;
            const loaiTin = AppConsts.smsLoaiTin.filter((x: ISelect) => x.value == newObj?.idLoaiTin);
            newObj.loaiTinNhan = loaiTin.length > 0 ? loaiTin[0].text : '';
            newObj.sTrangThaiGuiTinNhan = 'Thành công';

            const htSMS = await he_thong_sms_services.Insert_HeThongSMS(newObj);

            const nkyGuiTin = new NhatKyGuiTinSMSDto({
                idHeThongSMS: htSMS.id,
                idKhachHang: htSMS.idKhachHang,
                idChiNhanh: idChiNhanh,
                idHoaDon: objSMS.idHoaDon as unknown as null,
                idBooking: objSMS.idBooking as unknown as null,
                idLoaiTin: htSMS.idLoaiTin,
                thoiGianTu: fromDate,
                thoiGianDen: toDate
            });
            await he_thong_sms_services.ThemMoi_NhatKyGuiTinSMS(nkyGuiTin);
        }
    };

    const GuiTinZalo = async () => {
        let countErr = 0;
        let errMes = '';

        const check = await checkSave();
        if (!check) return;

        if (utils.checkNull(idMauTinZalo) || idMauTinZalo === Guid.EMPTY) {
            for (let i = 0; i < lstCustomerChosed.length; i++) {
                const cusItem = lstCustomerChosed[i];
                const result = await ZaloService.GuiTinTuVan(
                    suggestStore?.zaloAccessToken ?? '',
                    cusItem.user_id,
                    newSMS.noiDungTin
                );
                await saveHeThongSMS(cusItem, result.data, newSMS);
            }
        } else {
            // gửi tin theo mẫu ZNS/ mẫu của PM
            for (let index = 0; index < lstCustomerChosed?.length; index++) {
                const element = lstCustomerChosed[index];
                const sdt = element?.soDienThoai?.substring(1, element?.soDienThoai?.length);
                const dataSend: CustomerSMSDto = {
                    id: element.id,
                    idKhachHang: element?.idKhachHang,
                    zoaUserId: element.zoaUserId,
                    soDienThoai: isZNSTemplate ? `84${sdt}` : element?.soDienThoai,
                    ngaySinh: element?.ngaySinh,
                    tenKhachHang: element?.tenKhachHang ?? 'test mau tin ZNS',
                    maHoaDon: element?.maHoaDon ?? '',
                    ngayLapHoaDon: element?.ngayLapHoaDon ?? '',
                    tongThanhToan: element?.tongThanhToan,
                    ptThanhToan: element?.ptThanhToan,
                    tenHangHoa: element?.tenHangHoa,
                    bookingDate: element?.bookingDate,
                    startTime: element?.startTime,
                    tenChiNhanh: element?.tenChiNhanh,
                    diaChiChiNhanh: element?.diaChiChiNhanh,
                    soDienThoaiChiNhanh: element?.soDienThoaiChiNhanh,
                    tenCuaHang: element?.tenCuaHang,
                    diaChiCuaHang: element?.diaChiCuaHang,
                    dienThoaiCuaHang: element?.dienThoaiCuaHang,
                    idBooking: element?.idBooking,
                    idHoaDon: element?.idHoaDon
                };
                console.log('dataSend ', dataSend);

                // get noidungtin --> save to hethong_SMS
                switch (newSMS?.idLoaiTin) {
                    case LoaiTin.TIN_GIAO_DICH:
                        {
                            newSMS.noiDungTin = `${tieuDeMauTinZalo} Hóa đơn:  ${
                                dataSend?.maHoaDon
                            } <br/> Ngày lập:  ${format(
                                new Date(dataSend?.ngayLapHoaDon ?? new Date()),
                                'HH:mm dd/MM/yyyy'
                            )}<br /> Tổng tiền: ${new Intl.NumberFormat('vi-VN').format(dataSend?.tongThanhToan ?? 0)}`;
                        }
                        break;
                    case LoaiTin.TIN_LICH_HEN:
                        {
                            newSMS.noiDungTin = `${tieuDeMauTinZalo} dịch vụ:  ${
                                dataSend?.tenHangHoa
                            } <br/> Số điện thoại:  ${dataSend?.soDienThoai} <br /> Tên khách: ${
                                dataSend?.tenKhachHang
                            } <br/> Ngày đặt: ${format(
                                new Date(dataSend?.startTime ?? new Date()),
                                'HH:mm dd/MM/yyyy'
                            )}`;
                        }
                        break;
                    case LoaiTin.TIN_SINH_NHAT:
                        {
                            newSMS.noiDungTin = `${tieuDeMauTinZalo} khách hàng ${
                                dataSend?.tenKhachHang
                            }, ngày sinh:  ${format(new Date(dataSend?.ngaySinh ?? new Date()), 'dd/MM/yyy')}`;
                        }
                        break;
                    default:
                        {
                            newSMS.noiDungTin = `${tieuDeMauTinZalo}`;
                        }
                        break;
                }

                let dataZalo: IZaloResultMessage<IZaloDataMessage> = {
                    error: -1,
                    message: 'data null'
                } as IZaloResultMessage<IZaloDataMessage>;

                if (isZNSTemplate) {
                    dataZalo = await ZaloService.DevMode_GuiTinNhanGiaoDich_ByTempId(
                        suggestStore?.zaloAccessToken ?? '',
                        idMauTinZalo,
                        dataSend
                    );
                } else {
                    switch (zaloTempItem?.template_type) {
                        case ZaloConst.TemplateType.MESSAGE:
                            {
                                dataZalo = await ZaloService.GuiTinTuVan(
                                    suggestStore?.zaloAccessToken ?? '',
                                    dataSend.zoaUserId,
                                    textElm?.content
                                );
                            }
                            break;
                        case ZaloConst.TemplateType.MEDIA:
                            {
                                const imageElement = zaloTempItem?.elements?.filter(
                                    (x) => x.elementType === ZaloConst.ElementType.IMAGE
                                );
                                if (imageElement !== undefined && imageElement?.length > 0) {
                                    dataZalo = await ZaloService.GuiTinTuVan_KemAnh(
                                        suggestStore?.zaloAccessToken ?? '',
                                        dataSend.zoaUserId,
                                        textElm?.content,
                                        imageElement[0]?.content
                                    );
                                }
                            }
                            break;
                        default:
                            {
                                dataZalo = await ZaloService.GuiTinTruyenThongorGiaoDich_fromDataDB(
                                    dataSend,
                                    suggestStore?.zaloAccessToken ?? '',
                                    idMauTinZalo ?? ''
                                );
                            }
                            break;
                    }
                }

                if (dataZalo?.error !== 0) {
                    countErr += 1;
                    errMes += dataZalo?.message;
                } else {
                    await saveHeThongSMS(dataSend, dataZalo?.data, newSMS);
                }
            }
        }

        if (countErr === 0) {
            setObjAlert({ ...objAlert, mes: 'Gửi tin thành công', show: true, type: 1 });
            onOK(TypeAction.INSEART);
        } else {
            setObjAlert({ ...objAlert, mes: errMes, show: true, type: 2 });
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
                    Gửi tin nhắn Zalo
                </DialogTitle>
                <DialogButtonClose onClose={onClose} />

                <DialogContent sx={{ overflow: 'unset', paddingTop: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                <img src={inforZOA?.avatar} height={40} width={40} />
                                <Typography variant="body2" fontWeight={600}>
                                    {inforZOA?.name}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <SelectWithData
                                label="Loại tin"
                                data={AppConsts.smsLoaiTin}
                                idChosed={newSMS?.idLoaiTin}
                                handleChange={(item: ISelect) => {
                                    setNewSMS({ ...newSMS, idLoaiTin: item.value as number });
                                    switch (item.value) {
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
                            <AutocompleteWithData
                                label="Mẫu tin"
                                idChosed={idMauTinZalo}
                                lstData={allMauTinZalo
                                    ?.filter(
                                        (x) => x.idLoaiTin === newSMS.idLoaiTin || x.idLoaiTin === LoaiTin.TIN_THUONG
                                    )
                                    ?.map((x) => {
                                        return {
                                            id: x?.id,
                                            text1: x?.tenMauTin,
                                            text2: x?.isSystem ? '' : 'ZNS'
                                        } as IDataAutocomplete;
                                    })}
                                handleChoseItem={choseMauTinZNS}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack direction={'row'}>
                                <Zalo_MultipleAutoComplete_WithSDT {...propsDataCustomerZalo} />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {utils.checkNull(idMauTinZalo) || idMauTinZalo === Guid.EMPTY ? (
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    name="noiDungTin"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label={`Nội dung tin`}
                                    onChange={(e) => {
                                        setNewSMS({ ...newSMS, noiDungTin: e.target.value });
                                    }}
                                />
                            ) : isZNSTemplate ? (
                                <iframe
                                    src={itemMauTinZNS?.previewUrl}
                                    width={'100%'}
                                    height={'100%'}
                                    style={{ minHeight: '380px' }}
                                    name={itemMauTinZNS?.templateName}></iframe>
                            ) : (
                                <ZaloTemplateView
                                    logoBanner={imageUrl}
                                    headerText={headerElm?.content ?? ''}
                                    contentText={textElm?.content ?? ''}
                                    tables={tblDetail}
                                    buttons={lstButton}
                                />
                            )}
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
                        <Button
                            variant="contained"
                            sx={{ bgcolor: 'var(--color-main)!important' }}
                            className="btn-container-hover">
                            Đang lưu
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: 'var(--color-main)!important' }}
                                type="submit"
                                className="btn-container-hover"
                                startIcon={<SendOutlinedIcon />}
                                onClick={GuiTinZalo}>
                                Gửi
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
