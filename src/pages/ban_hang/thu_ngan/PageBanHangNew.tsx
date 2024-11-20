import * as React from 'react';
import {
    Box,
    Grid,
    Typography,
    Stack,
    Button,
    TextField,
    List,
    ListItem,
    Avatar,
    ListItemIcon,
    ListItemText,
    InputAdornment,
    RadioGroup,
    Radio,
    FormControlLabel,
    Badge
} from '@mui/material';
import closeIcon from '../../../images/closeSmall.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Add } from '@mui/icons-material';
import { useState, useEffect, useRef, useContext } from 'react';
import { debounce } from '@mui/material/utils';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import DetailHoaDon from './DetailHoaDon';
import ProductService from '../../../services/product/ProductService';
import GroupProductService from '../../../services/product/GroupProductService';

import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';

import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import BadgeFistCharOfName from '../../../components/Badge/FistCharOfName';

import { dbDexie } from '../../../lib/dexie/dexieDB';

import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import NhanSuItemDto from '../../../services/nhan-vien/dto/nhanSuItemDto';
import { Guid } from 'guid-typescript';
import utils from '../../../utils/utils';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';
import CheckinService from '../../../services/check_in/CheckinService';
import { IHangHoaGroupTheoNhomDto, ModelNhomHangHoa, PagedProductSearchDto } from '../../../services/product/dto';
import { PropConfirmOKCancel, PropModal } from '../../../utils/PropParentToChild';
import ModalEditChiTietGioHang from './modal_edit_chitiet';
import Cookies from 'js-cookie';

import { ReactComponent as DeleteIcon } from '../../../images/trash.svg';
import { ReactComponent as VoucherIcon } from '../../../images/voucherIcon.svg';
import { AppContext } from '../../../services/chi_nhanh/ChiNhanhContext';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import { PagedNhanSuRequestDto } from '../../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import nhanVienService from '../../../services/nhan-vien/nhanVienService';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import CreateOrEditCustomerDialog from '../../customer/components/create-or-edit-customer-modal';
import { KHCheckInDto, PageKhachHangCheckInDto } from '../../../services/check_in/CheckinDto';
import ModalAddCustomerCheckIn from '../../check_in/modal_add_cus_checkin';
import AppConsts, {
    HINH_THUC_THANH_TOAN,
    ISelect,
    LoaiChungTu,
    TrangThaiCheckin,
    TypeAction
} from '../../../lib/appconst';
import { NumericFormat } from 'react-number-format';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { ListNhanVienDataContext } from '../../../services/nhan-vien/dto/NhanVienDataContext';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import MauInServices from '../../../services/mau_in/MauInServices';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import { MauInDto } from '../../../services/mau_in/MauInDto';
import cuaHangService from '../../../services/cua_hang/cuaHangService';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import { CuaHangDto } from '../../../services/cua_hang/Dto/CuaHangDto';
import { SuggestTaiKhoanNganHangQrDto } from '../../../services/suggests/dto/SuggestTaiKhoanNganHangQrDTo';
import { observer } from 'mobx-react';
import TaiKhoanNganHangServices from '../../../services/so_quy/TaiKhoanNganHangServices';
import AutocompleteAccountBank from '../../../components/Autocomplete/AccountBank';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { handleClickOutside } from '../../../utils/customReactHook';
import abpCustom from '../../../components/abp-custom';
import HoaHongNhanVienDichVu from '../../nhan_vien_thuc_hien/hoa_hong_nhan_vien_dich_vu';
import DatePickerRequireCustom from '../../../components/DatetimePicker/DatePickerRequiredCustom';
import { format } from 'date-fns';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import { SuggestChiNhanhDto } from '../../../services/suggests/dto/SuggestChiNhanhDto';
import uploadFileService from '../../../services/uploadFileService';
import QRCodeBaoKim from '../../bao_kim_payment/QRCode';
import { IBankInfor, IResponseThongBaoGiaoDich } from '../../../services/bao_kim_payment/BaoKimDto';
import BaoKimPaymentService from '../../../services/bao_kim_payment/BaoKimPaymentService';
import HoaDonDto from '../../../services/ban_hang/HoaDonDto';
import ThongBaoGiaoDich from '../../bao_kim_payment/ThongBaoGiaoDich';
import cassoApiService from '../../../services/casso_api/cassoApiService';
import { HubConnectionBuilder } from '@microsoft/signalr';

const PageBanHang = ({ customerChosed, horizontalLayout }: any) => {
    const appContext = useContext(AppContext);
    const chiNhanhCurrent = appContext.chinhanhCurrent;
    const [txtSearch, setTxtSearch] = useState('');
    const isFirstRender = useRef(true);
    const afterRender = useRef(false);
    const [clickSSave, setClickSave] = useState(false);
    const [isPrint, setIsPrint] = useState(false); // todo check on/off print
    const [idNhomHang, setIdNhomHang] = useState('');
    const [idLoaiHangHoa, setIdLoaiHangHoa] = useState(0);
    const [allNhomHangHoa, setAllNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allChiNhanh_byUser, setAllChiNhanh_byUser] = useState<SuggestChiNhanhDto[]>([]);
    const [dateDefault, setDateDefault] = useState('');

    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [allMauIn, setAllMauIn] = useState<MauInDto[]>([]);
    const [cusChosing, setCusChosing] = useState<CreateOrEditKhachHangDto>();
    const idChiNhanh = utils.checkNull(chiNhanhCurrent?.id) ? Cookies.get('IdChiNhanh') : chiNhanhCurrent?.id ?? '';

    const [txtSearchInvoiceWaiting, setTxtSearchInvoiceWaiting] = useState('');
    const [isExpandShoppingCart, setIsExpandShoppingCart] = useState(false);
    const [allInvoiceWaiting, setAllInvoiceWaiting] = useState<PageHoaDonDto[]>([]);
    const [lstSearchInvoiceWaiting, setLstSearchInvoiceWaiting] = useState<PageHoaDonDto[]>([]);
    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [idCTHDChosing, setIdCTHDChosing] = useState(''); // used to edit giohang
    const [idHoaDonChosing, setIdHoaDonChosing] = useState<string | null>(''); // used to hd waiting

    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [propNVThucHien, setPropNVThucHien] = useState<PropModal>(new PropModal({ isShow: false, isNew: true }));
    const [isShowModalCheckIn, setIsShowModalCheckIn] = useState(false);
    const [isAddNewCheckIn, setIsAddNewCheckIn] = useState(false);
    const [idCheckInUpdate, setIdCheckInUpdate] = useState('');

    const [isShowQRCode, setIsShowQRCode] = useState(false);
    const [qrCodeBank, setQRCodeBank] = useState<IBankInfor>({} as IBankInfor);

    const [isGiaoDichOK, setIsGiaoDichOK] = useState(false);

    const ref = handleClickOutside(() => setIsExpandShoppingCart(false));

    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: null,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: idChiNhanh
        })
    );
    const [lstQuyCT, setLstQuyCT] = useState<QuyChiTietDto[]>([
        new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT }) // !! important: luôn set ít nhất 1 giá trị cho mảng quỹ chi tiết
    ]);

    // used to check update infor cthd
    const [cthdDoing, setCTHDDoing] = useState<PageHoaDonChiTietDto>(
        new PageHoaDonChiTietDto({ id: '', expanded: false })
    );

    const [inforDelete, setinforDelete] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        setAllNhomHangHoa(list.items);
    };
    const nhomDichVu = allNhomHangHoa.filter((x) => !x.laNhomHangHoa);
    const nhomHangHoa = allNhomHangHoa.filter((x) => x.laNhomHangHoa);

    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);

        // await cassoApiService.TaoWebhook();
    };

    const GetAllMauIn_byChiNhanh = async () => {
        const data = await MauInServices.GetAllMauIn_byChiNhanh();
        setAllMauIn(data);
    };

    const GetChiNhanhByUser = async () => {
        const data = await chiNhanhService.GetChiNhanhByUser();
        setAllChiNhanh_byUser(data);
    };

    const getInforChiNhanh_byID = async (idChiNhanh: string) => {
        const data = await chiNhanhService.GetDetail(idChiNhanh ?? '');
        return data;
    };

    const GetAllInvoiceWaiting = async () => {
        // get list hoadon from cache
        const allHD = await dbDexie.hoaDon
            .where('idChiNhanh')
            .equals(idChiNhanh as string)
            .sortBy('ngayLapHoaDon');

        for (let i = 0; i < allHD?.length; i++) {
            if (!utils.checkNull_OrEmpty(allHD[i]?.idKhachHang)) {
                const customer = await khachHangService.getKhachHang(allHD[i]?.idKhachHang ?? '');
                if (customer != null && customer !== undefined) {
                    // update infor customer to cache (if customer has change)
                    await dbDexie.hoaDon.update(allHD[i]?.id, {
                        tenKhachHang: customer?.tenKhachHang,
                        maKhachHang: customer?.maKhachHang,
                        soDienThoai: customer?.soDienThoai
                    });
                }
            }
        }
        const allHDAfter = await dbDexie.hoaDon
            .where('idChiNhanh')
            .equals(idChiNhanh as string)
            .sortBy('ngayLapHoaDon');

        setAllInvoiceWaiting(allHDAfter);
        setLstSearchInvoiceWaiting([...allHDAfter]);
    };

    let timmer: any;

    const timer = () => {
        // yyyy-MM-dd HH:mm
        // nếu ngayLapHoaDon muốn hiển thị HH:mm --> chạy tự động hàm này
        const toDay = new Date();
        const date = toDay.getDate();
        const month = toDay.getMonth() + 1;
        const year = toDay.getFullYear();
        const hours = toDay.getHours();
        const minutes = toDay.getMinutes();
        const seconds = toDay.getSeconds();

        let ngaythangnam = `${year}`;
        let giophut = `${hours}`;

        if (month < 10) {
            ngaythangnam += `-0${month}`;
        } else {
            ngaythangnam += `-${month}`;
        }
        if (date < 10) {
            ngaythangnam += `-0${date}`;
        } else {
            ngaythangnam += `-${date}`;
        }

        if (hours < 10) {
            giophut = `0${hours}`;
        }
        if (minutes < 10) {
            giophut += `:0${minutes}`;
        } else {
            giophut += `:${minutes}`;
        }

        timmer = setTimeout(timer, 1000);
        setDateDefault(`${ngaythangnam} ${giophut}`);
    };
    const OnOff_Timer = () => {
        if (utils.checkNull(hoadon?.ngayLapHoaDon)) {
            clearTimeout(timmer);
            timer();
        } else {
            clearTimeout(timmer);
        }
    };

    const PageLoad = async () => {
        await GetTreeNhomHangHoa();
        await GetListNhanVien();
        await GetAllMauIn_byChiNhanh();
        await GetAllInvoiceWaiting();
        await GetChiNhanhByUser();

        afterRender.current = true;
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        PageLoad();
        console.log('pagebanHang ');
    }, []);

    useEffect(() => {
        FirstLoad_getSetDataFromCache();
    }, [customerChosed.idCheckIn]);

    const getListHangHoa_groupbyNhom = async () => {
        const input = {
            IdNhomHangHoas: idNhomHang,
            TextSearch: '',
            IdLoaiHangHoa: idLoaiHangHoa,
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);
    };

    React.useEffect(() => {
        if (isFirstRender.current) return;
        getListHangHoa_groupbyNhom();
    }, [idNhomHang, idLoaiHangHoa]);

    // only used when change textsearch
    const debounceDropDown = useRef(
        debounce(async (input: any) => {
            const data = await ProductService.GetDMHangHoa_groupByNhom(input);
            setListProduct(data);
        }, 500)
    ).current;

    React.useEffect(() => {
        if (!afterRender.current) return;
        // if search, reset inhom +loaihang
        const input = {
            IdNhomHangHoas: '',
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0,
            CurrentPage: 0,
            PageSize: 50
        };

        debounceDropDown(input);
    }, [txtSearch]);

    // filter list product
    const choseNhomDichVu = async (item: ModelNhomHangHoa) => {
        setIdNhomHang(item.id as string);
        setIdLoaiHangHoa(0);
    };

    const choseLoaiHang = (type: number) => {
        setTxtSearch('');
        setIdNhomHang('');
        setIdLoaiHangHoa(type);
    };
    // end filter

    const FirstLoad_getSetDataFromCache = async () => {
        if (!utils.checkNull(customerChosed.idKhachHang)) {
            const data = await dbDexie.hoaDon
                .where('idCheckIn')
                .equals(customerChosed?.idCheckIn)
                .and((x) => x.idChiNhanh == idChiNhanh)
                .toArray();

            if (data.length === 0) {
                const dataHD: PageHoaDonDto = {
                    ...hoadon,
                    id: Guid.create().toString(),
                    idChiNhanh: idChiNhanh,
                    idCheckIn: customerChosed.idCheckIn,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang ?? 'Khách lẻ',
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
                await dbDexie.hoaDon.add(dataHD);
                setHoaDon(dataHD);
            } else {
                // get hoadon + cthd
                const hdctCache = data[0].hoaDonChiTiet ?? [];
                setHoaDon(data[0]);
                setHoaDonChiTiet(hdctCache);
            }
        } else {
            // asisgn hoadon
            setHoaDon((old) => {
                return {
                    ...old,
                    idCheckIn: customerChosed.idCheckIn,
                    idKhachHang: customerChosed.idKhachHang,
                    maKhachHang: customerChosed.maKhachHang,
                    tenKhachHang: customerChosed.tenKhachHang ?? 'Khách lẻ',
                    soDienThoai: customerChosed.soDienThoai,
                    tongTichDiem: customerChosed.tongTichDiem
                };
            });
        }
        setIdCheckInUpdate(customerChosed?.idCheckIn);
        await GetSetCusChosing(customerChosed.idKhachHang);
    };

    // invoice waiting

    const showAllInvoiceWaiting = async () => {
        setIsExpandShoppingCart(true);
        setTxtSearchInvoiceWaiting('');
        // get again: because cthd/hoadon has update
        await GetAllInvoiceWaiting();
    };

    useEffect(() => {
        if (!utils.checkNull(txtSearchInvoiceWaiting)) {
            const txt = txtSearchInvoiceWaiting.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allInvoiceWaiting.filter(
                (x) =>
                    (x.maKhachHang !== null && x.maKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenKhachHang !== null && x.tenKhachHang.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maKhachHang !== null && utils.strToEnglish(x.maKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.tenKhachHang !== null && utils.strToEnglish(x.tenKhachHang).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1) ||
                    (x.tongThanhToan !== null &&
                        utils.strToEnglish(x.tongThanhToan?.toString()).indexOf(txtUnsign) > -1)
            );
            setLstSearchInvoiceWaiting(data);
        } else {
            setLstSearchInvoiceWaiting([...allInvoiceWaiting]);
        }
    }, [txtSearchInvoiceWaiting]);

    const removeItemInvoiceWaiting = async () => {
        const itemHD = await dbDexie.hoaDon.get(idHoaDonChosing ?? '');
        await dbDexie.hoaDon.delete(idHoaDonChosing ?? '');

        const allInvoiceWaitingAfter = allInvoiceWaiting.filter((x) => x.id !== idHoaDonChosing);
        setLstSearchInvoiceWaiting(lstSearchInvoiceWaiting.filter((x) => x.id !== idHoaDonChosing));
        setAllInvoiceWaiting([...allInvoiceWaitingAfter]);

        // update status customer checking DB
        if (!utils.checkNull(itemHD?.idCheckIn) && (itemHD?.idCheckIn ?? '') !== Guid.EMPTY) {
            await CheckinService.UpdateTrangThaiCheckin(itemHD?.idCheckIn ?? '', TrangThaiCheckin.DELETED);
        }

        // check if hdOpening --> again again infor to hoaDon other (first in list)
        if (hoadon?.id === idHoaDonChosing) {
            const idHdFirst = allInvoiceWaitingAfter.length > 0 ? allInvoiceWaitingAfter[0].id : '';
            if (!utils.checkNull(idHdFirst)) {
                await getInforHDCacheById(idHdFirst);
            } else {
                // reset & create new hoadon
                ResetState_AfterSave();
            }
        } else {
            // reset & create new hoadon
            ResetState_AfterSave();
        }
    };

    const getInforHDCacheById = async (idHoaDon: string) => {
        const itemHD = await dbDexie.hoaDon.get(idHoaDon ?? '');
        if (itemHD !== undefined) {
            setHoaDon(itemHD);
            setHoaDonChiTiet(itemHD?.hoaDonChiTiet ?? []);
            setIdCheckInUpdate(itemHD?.idCheckIn);
            await GetSetCusChosing(itemHD?.idKhachHang as unknown as string);
        }
    };

    const onChoseInvoiceWaiting = async (idHoaDon: string) => {
        setIsExpandShoppingCart(false);
        setIdHoaDonChosing(idHoaDon);

        await getInforHDCacheById(idHoaDon);
    };

    const onClickConfirmDelete = async () => {
        if (idHoaDonChosing !== null) {
            await removeItemInvoiceWaiting();
        } else {
            // remove all
            await dbDexie.hoaDon.toCollection().delete();
            setLstSearchInvoiceWaiting([]);
            setAllInvoiceWaiting([]);
            setIsExpandShoppingCart(false);
            ResetState_AfterSave();

            // update status customer checking DB
            for (let i = 0; i < allInvoiceWaiting.length; i++) {
                const idCheckin = allInvoiceWaiting[i]?.idCheckIn;
                if (!utils.checkNull(idCheckin) && (idCheckin ?? '') !== Guid.EMPTY) {
                    await CheckinService.UpdateTrangThaiCheckin(idCheckin ?? '', TrangThaiCheckin.DELETED);
                }
            }
        }
        setinforDelete({ ...inforDelete, show: false });
    };
    // end invoice waiting

    const GetSetCusChosing = async (idCus: string) => {
        const dataCus = await khachHangService.getKhachHang(idCus);
        if (dataCus != null) {
            setCusChosing(dataCus);
        }
    };

    const updateCurrentInvoice = async () => {
        let tongTienHangChuaCK = 0,
            tongChietKhau = 0,
            tongThueChiTiet = 0,
            tongTienHang = 0,
            thanhtiensauVAT = 0;

        for (let i = 0; i < hoaDonChiTiet.length; i++) {
            const itFor = hoaDonChiTiet[i];
            tongTienHangChuaCK += itFor.soLuong * itFor.donGiaTruocCK;
            tongTienHang += itFor.thanhTienSauCK ?? 0;
            tongChietKhau += (itFor.tienChietKhau ?? 0) * itFor.soLuong;
            tongThueChiTiet += (itFor.tienThue ?? 0) * itFor.soLuong;
            thanhtiensauVAT += itFor.thanhTienSauVAT ?? 0;
        }
        const dataHD = {
            ...hoadon,
            tongTienHangChuaChietKhau: tongTienHangChuaCK,
            tongChietKhauHangHoa: tongChietKhau,
            tongTienHang: tongTienHang,
            tongTienThue: tongThueChiTiet,
            tongTienHDSauVAT: thanhtiensauVAT,
            tongThanhToan: thanhtiensauVAT - (hoadon?.tongGiamGiaHD ?? 0),
            hoaDonChiTiet: hoaDonChiTiet
        };
        setHoaDon((old: PageHoaDonDto) => {
            return {
                ...old,
                tongTienHangChuaChietKhau: tongTienHangChuaCK,
                tongTienHang: tongTienHang,
                tongChietKhauHangHoa: tongChietKhau,
                tongTienHDSauVAT: thanhtiensauVAT,
                tongThanhToan: thanhtiensauVAT - (hoadon?.tongGiamGiaHD ?? 0),
                hoaDonChiTiet: hoaDonChiTiet
            };
        });

        UpdateCacheHD(dataHD);
    };

    const UpdateCacheHD = async (dataHD: any) => {
        const id = dataHD.id ?? Guid.create().toString();
        const data = await dbDexie.hoaDon.where('id').equals(id).toArray();

        if (data.length > 0) {
            const rowDelete = await dbDexie.hoaDon.where('id').equals(id).delete();
            if (rowDelete > 0) {
                await dbDexie.hoaDon.add(dataHD);
            }
        }
    };

    useEffect(() => {
        if (!afterRender.current) return;
        updateCurrentInvoice();
    }, [hoaDonChiTiet]);

    const deleteChiTietHoaDon = async (item: any) => {
        const arrCTnew = hoaDonChiTiet.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
        setHoaDonChiTiet([...arrCTnew]);

        if (arrCTnew.length === 0) {
            // reset again trangthai check in = dang cho
            await CheckinService.UpdateTrangThaiCheckin(idCheckInUpdate, TrangThaiCheckin.WAITING);
        }
    };

    const choseChiTiet = async (item: any, index: any) => {
        setIsExpandShoppingCart(false);
        const newCT = new PageHoaDonChiTietDto({
            idDonViQuyDoi: item.idDonViQuyDoi,
            maHangHoa: item.maHangHoa,
            tenHangHoa: item.tenHangHoa,
            giaBan: item.giaBan,
            idNhomHangHoa: item.idNhomHangHoa,
            idHangHoa: item.id,
            soLuong: 1,
            expanded: false
        });

        const checkCT = hoaDonChiTiet.filter((x) => x.idDonViQuyDoi === item.idDonViQuyDoi);
        if (checkCT.length === 0) {
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...olds];
            });
        } else {
            newCT.id = checkCT[0].id; // get ID old --> check update nvThucHien + chietkhau
            newCT.soLuong = checkCT[0].soLuong + 1;
            newCT.nhanVienThucHien = checkCT[0].nhanVienThucHien;

            // remove & unshift but keep infor old cthd
            const arrOld = hoaDonChiTiet?.filter((x) => x.idDonViQuyDoi !== item.idDonViQuyDoi);
            setHoaDonChiTiet((olds: any) => {
                return [newCT, ...arrOld];
            });
        }
        setCTHDDoing(newCT);

        // update trangThaiCheckin = Dang thuc hien
        // chỉ cập nhật nếu add chi tiết lần đầu tiên
        await CheckinService.UpdateTrangThaiCheckin(idCheckInUpdate, TrangThaiCheckin.DOING);
    };

    // auto update cthd
    useEffect(() => {
        if (!afterRender.current) return;
        Update_HoaDonChiTiet();
        UpdateHoaHongDichVu_forNVThucHien();
    }, [cthdDoing]);

    const UpdateHoaHongDichVu_forNVThucHien = () => {
        // update for all nvth thuoc ctDoing
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthdDoing.id) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.map((nv) => {
                            if (nv.ptChietKhau > 0) {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.ptChietKhau * (x.thanhTienSauCK ?? 0)) / 100
                                };
                            } else {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.chietKhauMacDinh ?? 0) * x.soLuong
                                };
                            }
                        })
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const Update_HoaDonChiTiet = () => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthdDoing.id) {
                    return {
                        ...x,
                        tienChietKhau:
                            (x.ptChietKhau ?? 0) > 0 ? (x.donGiaTruocCK * (x.ptChietKhau ?? 0)) / 100 : x.tienChietKhau,
                        tienThue: (x.ptThue ?? 0) > 0 ? ((x.donGiaSauCK ?? 0) * (x.ptThue ?? 0)) / 100 : x.tienThue
                    };
                } else {
                    return x;
                }
            })
        );
    };

    const showPopNhanVienThucHien = (item: HoaDonChiTietDto) => {
        setPropNVThucHien((old) => {
            return { ...old, isShow: true, isNew: true, item: item, id: item.id };
        });
    };
    const AgreeNVThucHien = (lstNVChosed: any) => {
        setPropNVThucHien({ ...propNVThucHien, isShow: false });
        // update cthd + save to cache
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (propNVThucHien.item.id === x.id) {
                    return { ...x, nhanVienThucHien: lstNVChosed };
                } else {
                    return x;
                }
            })
        );
    };
    const RemoveNVThucHien = (cthd: any, nv: any) => {
        setHoaDonChiTiet(
            hoaDonChiTiet.map((x) => {
                if (x.id === cthd.id) {
                    return {
                        ...x,
                        nhanVienThucHien: x.nhanVienThucHien?.filter((nvth) => nvth.idNhanVien !== nv.idNhanVien)
                    };
                } else {
                    return x;
                }
            })
        );
    };

    // modal chitiet giohang
    const showPopChiTietGioHang = (item: HoaDonChiTietDto) => {
        setIsShowEditGioHang(true);
        setIdCTHDChosing(item?.id);
        setIsExpandShoppingCart(false);
    };

    const AgreeGioHang = (lstCTAfter: PageHoaDonChiTietDto[]) => {
        setIsShowEditGioHang(false);
        if (lstCTAfter?.length > 0) {
            const ctUpdate = lstCTAfter[0];
            // assign ctdoing --> used to update hoadhong dichvu of nhanvien
            setCTHDDoing({
                ...cthdDoing,
                soLuong: ctUpdate.soLuong,
                donGiaTruocCK: ctUpdate.donGiaTruocCK,
                laPTChietKhau: ctUpdate.laPTChietKhau,
                ptChietKhau: ctUpdate.ptChietKhau,
                tienChietKhau: ctUpdate.tienChietKhau,
                donGiaSauCK: ctUpdate.donGiaSauCK,
                donGiaSauVAT: ctUpdate.donGiaSauVAT,
                thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
                thanhTienSauCK: ctUpdate.thanhTienSauCK,
                thanhTienSauVAT: ctUpdate.thanhTienSauVAT
            });
            // update cthd + save to cache
            setHoaDonChiTiet(
                hoaDonChiTiet.map((item) => {
                    if (item.id === ctUpdate.id) {
                        return {
                            ...item,
                            soLuong: ctUpdate.soLuong,
                            donGiaTruocCK: ctUpdate.donGiaTruocCK,
                            laPTChietKhau: ctUpdate.laPTChietKhau,
                            ptChietKhau: ctUpdate.ptChietKhau,
                            tienChietKhau: ctUpdate.tienChietKhau,
                            donGiaSauCK: ctUpdate.donGiaSauCK,
                            donGiaSauVAT: ctUpdate.donGiaSauVAT,
                            thanhTienTruocCK: ctUpdate.thanhTienTruocCK,
                            thanhTienSauCK: ctUpdate.thanhTienSauCK,
                            thanhTienSauVAT: ctUpdate.thanhTienSauVAT
                        };
                    } else {
                        return item;
                    }
                })
            );
        }
    };

    // end modal chi tiet

    const RemoveCache = async () => {
        await dbDexie.hoaDon.where('id').equals(hoadon.id).delete();
        setAllInvoiceWaiting(allInvoiceWaiting.filter((x) => x.id !== hoadon.id));
        setLstSearchInvoiceWaiting(allInvoiceWaiting.filter((x) => x.id !== hoadon.id));
    };

    // customer: add/remove
    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);

    const changeCustomer = async (item: any = null) => {
        const cusChecking = new PageKhachHangCheckInDto({
            idKhachHang: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: 'Khách lẻ',
            soDienThoai: '',
            tongTichDiem: 0
        });
        if (item !== null) {
            setIsShowModalAddCus(false);
            cusChecking.idKhachHang = item?.id;
            cusChecking.tenKhachHang = item?.tenKhachHang;
            cusChecking.maKhachHang = item?.maKhachHang;
            cusChecking.soDienThoai = item?.soDienThoai;

            const objCheckIn: KHCheckInDto = new KHCheckInDto({
                idKhachHang: cusChecking.idKhachHang as string,
                idChiNhanh: idChiNhanh
            });
            const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckIn);
            cusChecking.idCheckIn = dataCheckIn.id;
            cusChecking.dateTimeCheckIn = dataCheckIn.dateTimeCheckIn;

            setIdCheckInUpdate(dataCheckIn.id);

            setCusChosing({
                ...cusChosing,
                id: item?.id,
                maKhachHang: item?.maKhachHang,
                tenKhachHang: item?.tenKhachHang,
                tongTichDiem: item?.tongTichDiem,
                avatar: item?.avatar ?? ''
            } as CreateOrEditKhachHangDto);
        } else {
            setCusChosing({
                ...cusChosing,
                id: '',
                maKhachHang: 'KL',
                tenKhachHang: 'Khách lẻ',
                tongTichDiem: 0,
                avatar: ''
            } as CreateOrEditKhachHangDto);
        }

        setHoaDon({
            ...hoadon,
            idCheckIn: cusChecking?.idCheckIn,
            idKhachHang: cusChecking?.idKhachHang as unknown as null,
            maKhachHang: cusChecking?.maKhachHang,
            tenKhachHang: cusChecking?.tenKhachHang,
            soDienThoai: cusChecking?.soDienThoai
        });

        await updateCache_IfChangeCus(cusChecking, hoadon.id);
        setNewCus(item); // gán luôn để nếu có click xem thông tin khách hàng, thì không phải DB để lấy nữa
    };

    const showModalAddCustomer = () => {
        setIsShowModalAddCus(true);
        setNewCus({
            id: Guid.EMPTY,
            maKhachHang: '',
            tenKhachHang: '',
            soDienThoai: '',
            diaChi: '',
            idNhomKhach: '',
            idNguonKhach: '',
            gioiTinhNam: false,
            moTa: '',
            idLoaiKhach: 1
        } as CreateOrEditKhachHangDto);
    };

    const showModalEditCus = async () => {
        if (Object.keys(newCus)) {
            // check object empty
            // used to first load --> not changeCus
            const dataCus = await khachHangService.getKhachHang(hoadon?.idKhachHang ?? '');
            setNewCus(dataCus);
        }
        setIsShowModalAddCus(true);
    };

    const updateCache_IfChangeCus = async (dataCheckIn: PageKhachHangCheckInDto, idHoaDon: string) => {
        const action = isAddNewCheckIn ? TypeAction.INSEART : TypeAction.UPDATE;
        switch (action) {
            case TypeAction.INSEART:
                {
                    const dataHD: PageHoaDonDto = {
                        ...hoadon,
                        id: idHoaDon,
                        idChiNhanh: idChiNhanh,
                        idCheckIn: dataCheckIn?.idCheckIn,
                        idKhachHang: dataCheckIn?.idKhachHang,
                        maKhachHang: dataCheckIn?.maKhachHang,
                        tenKhachHang: dataCheckIn?.tenKhachHang ?? 'Khách lẻ',
                        soDienThoai: dataCheckIn?.soDienThoai,
                        hoaDonChiTiet: []
                    };
                    await dbDexie.hoaDon.add(dataHD);
                }
                break;
            case TypeAction.UPDATE:
                {
                    const cacheOld = await dbDexie.hoaDon.where('id').equals(hoadon?.id).toArray();
                    if (cacheOld.length > 0) {
                        await dbDexie.hoaDon.update(hoadon?.id, {
                            idCheckIn: dataCheckIn?.idCheckIn,
                            idKhachHang: dataCheckIn?.idKhachHang,
                            tenKhachHang: dataCheckIn?.tenKhachHang,
                            maKhachHang: dataCheckIn?.maKhachHang,
                            soDienThoai: dataCheckIn?.soDienThoai
                        });
                    } else {
                        const dataHD: PageHoaDonDto = {
                            ...hoadon,
                            id: idHoaDon,
                            idChiNhanh: idChiNhanh,
                            idCheckIn: dataCheckIn?.idCheckIn,
                            idKhachHang: dataCheckIn?.idKhachHang,
                            maKhachHang: dataCheckIn?.maKhachHang,
                            tenKhachHang: dataCheckIn?.tenKhachHang ?? 'Khách lẻ',
                            soDienThoai: dataCheckIn?.soDienThoai
                        };
                        await dbDexie.hoaDon.add(dataHD);
                    }
                }
                break;
            case TypeAction.DELETE:
                {
                    await dbDexie.hoaDon.where('idCheckIn').equals(idCheckInUpdate).delete();
                }
                break;
        }
    };

    const showModalCheckIn = async (isNew = true) => {
        setIsAddNewCheckIn(isNew);
        setIsShowModalCheckIn(true);
        if (isNew) {
            setIdCheckInUpdate('');
        } else {
            setIdCheckInUpdate(hoadon?.idCheckIn);
        }
    };

    const saveCheckInOK = async (typeAction = TypeAction.INSEART, dataCheckIn: PageKhachHangCheckInDto | undefined) => {
        if (dataCheckIn !== undefined) {
            setIdCheckInUpdate(dataCheckIn.idCheckIn);
            setIsShowModalCheckIn(false);

            const action = isAddNewCheckIn ? TypeAction.INSEART : TypeAction.UPDATE;
            if (action === TypeAction.INSEART) {
                // check khachhang was booking
                const data = await dbDexie.hoaDon.where('idCheckIn').equals(dataCheckIn.idCheckIn).toArray();
                if (data != null && data.length > 0) {
                    const hdctCache = data[0].hoaDonChiTiet ?? [];
                    setHoaDon({
                        ...hoadon,
                        id: data[0].id, // vì sau khi booking, đã gán lại id mới cho hóa đơn
                        idKhachHang: dataCheckIn?.idKhachHang,
                        idCheckIn: dataCheckIn?.idCheckIn,
                        maKhachHang: dataCheckIn?.maKhachHang,
                        soDienThoai: dataCheckIn?.soDienThoai,
                        tenKhachHang: dataCheckIn?.tenKhachHang,
                        tongTienHang: data[0].tongTienHang,
                        tongTienHDSauVAT: data[0].tongTienHDSauVAT,
                        tongThanhToan: data[0].tongThanhToan,
                        tongTienHangChuaChietKhau: data[0].tongTienHangChuaChietKhau
                    });
                    setHoaDonChiTiet(hdctCache);
                } else {
                    setHoaDon({
                        ...hoadon,
                        id: Guid.create().toString(), // create new hd
                        idKhachHang: dataCheckIn?.idKhachHang,
                        idCheckIn: dataCheckIn?.idCheckIn,
                        maKhachHang: dataCheckIn?.maKhachHang,
                        soDienThoai: dataCheckIn?.soDienThoai,
                        tenKhachHang: dataCheckIn?.tenKhachHang,
                        tongTienHang: 0,
                        tongTienHDSauVAT: 0,
                        tongThanhToan: 0,
                        tongTienHangChuaChietKhau: 0
                    });
                    setHoaDonChiTiet([]);
                }
            } else {
                // update
                const dataHD: PageHoaDonDto = {
                    ...hoadon,
                    idChiNhanh: idChiNhanh,
                    idCheckIn: dataCheckIn?.idCheckIn ?? '',
                    idKhachHang: dataCheckIn?.idKhachHang ?? null,
                    maKhachHang: dataCheckIn?.maKhachHang ?? 'KL',
                    tenKhachHang: dataCheckIn?.tenKhachHang ?? 'Khách lẻ',
                    soDienThoai: dataCheckIn?.soDienThoai ?? ''
                };
                setHoaDon(dataHD);
                await updateCache_IfChangeCus(dataCheckIn, hoadon?.id);
            }
            await GetAllInvoiceWaiting();
            await GetSetCusChosing(dataCheckIn.idKhachHang ?? '');
        }
    };

    const checkSave = async () => {
        if (hoaDonChiTiet.length === 0) {
            setObjAlert({
                show: true,
                type: 2,
                mes: 'Vui lòng nhập chi tiết hóa đơn '
            });
            return false;
        }
        if (utils.checkNull(hoadon?.idKhachHang) || hoadon?.idKhachHang === Guid.EMPTY) {
            if (sumTienKhachTra < hoadon?.tongThanhToan) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Là khách lẻ. Không cho phép nợ'
                });
                return false;
            }
        }
        // if (lstQuyCT.length === 0) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn hình thức thanh toán '
        //     });
        //     return false;
        // }

        // const itemPos = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 3);
        // if (itemPos.length > 0 && utils.checkNull(itemPos[0].idTaiKhoanNganHang)) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn tài khoản POS'
        //     });
        //     return false;
        // }

        // const itemCK = lstQuyCT.filter((x: QuyChiTietDto) => x.hinhThucThanhToan === 2);
        // if (itemCK.length > 0 && utils.checkNull(itemCK[0].idTaiKhoanNganHang)) {
        //     setObjAlert({
        //         show: true,
        //         type: 2,
        //         mes: 'Vui lòng chọn tài khoản chuyển khoản'
        //     });
        //     return false;
        // }

        return true;
    };

    // form payment

    const assignThongTinThanhToan = (arrQCT: QuyChiTietDto[]) => {
        setLstQuyCT([...arrQCT]);

        const tienKhachTra = utils.RoundDecimal(
            arrQCT.reduce((currentValue: number, item: QuyChiTietDto) => {
                return item.tienThu + utils.formatNumberToFloat(currentValue);
            }, 0)
        );

        setSumTienKhachTra(tienKhachTra);
        setTienThuaTraKhach(tienKhachTra - hoadon?.tongThanhToan);

        const itChuyenKhoan = arrQCT?.filter((x) => x.hinhThucThanhToan !== HINH_THUC_THANH_TOAN.TIEN_MAT);
        if (itChuyenKhoan.length > 0) {
            setTaiKhoanNganHang({
                ...taiKhoanNganHang,
                id: itChuyenKhoan[0].idTaiKhoanNganHang as unknown as string,
                soTaiKhoan: itChuyenKhoan[0].soTaiKhoan ?? '',
                tenTaiKhoan: itChuyenKhoan[0].tenChuThe ?? '',
                bin: itChuyenKhoan[0].maPinNganHang ?? ''
            });
        }
    };

    const onChangeGhiChuHD_atPayment = async (ghiChuHD: string) => {
        setHoaDon({
            ...hoadon,
            ghiChuHD: ghiChuHD
        });
        await dbDexie.hoaDon.update(hoadon?.id, {
            ghiChuHD: ghiChuHD
        });
    };

    const editInforHoaDon_atPayment = async (ptGiamGiaHD: number, tongGiamGiaHD: number, khachPhaiTra: number) => {
        setHoaDon({
            ...hoadon,
            pTGiamGiaHD: ptGiamGiaHD,
            tongGiamGiaHD: tongGiamGiaHD,
            tongThanhToan: khachPhaiTra
        });
        try {
            await dbDexie.hoaDon.update(hoadon?.id, {
                pTGiamGiaHD: ptGiamGiaHD,
                tongGiamGiaHD: tongGiamGiaHD,
                tongThanhToan: khachPhaiTra
            });
        } catch {
            //
        }
    };
    // end form payment

    const changeNgayLapHoaDon = async (dt: string) => {
        setHoaDon({
            ...hoadon,
            ngayLapHoaDon: dt
        });
        await dbDexie.hoaDon.update(hoadon?.id, {
            ngayLapHoaDon: dt
        });
        // update ngaycheckin??
    };

    const saveDiaryHoaDon = async (maHoaDon: string, ngaylapHoaDonDB: string) => {
        let sDetails = '';
        for (let i = 0; i < hoaDonChiTiet?.length; i++) {
            const itFor = hoaDonChiTiet[i];
            sDetails += ` <br /> ${i + 1}. ${itFor?.tenHangHoa} (${itFor?.maHangHoa}): ${
                itFor?.soLuong
            } x  ${Intl.NumberFormat('vi-VN').format(itFor?.donGiaTruocCK)}  =  ${Intl.NumberFormat('vi-VN').format(
                itFor?.thanhTienSauCK ?? 0
            )}`;
        }

        let txtKhachHang = '';
        if (utils.checkNull(hoadon?.soDienThoai)) {
            txtKhachHang = `${hoadon?.tenKhachHang}`;
        } else {
            txtKhachHang = ` ${hoadon?.tenKhachHang} (${hoadon?.soDienThoai})`;
        }

        const diary = {
            idChiNhanh: idChiNhanh,
            noiDung: `Thêm mới hóa đơn ${maHoaDon}, khách hàng: ${txtKhachHang}`,
            chucNang: 'Thêm mới hóa đơn',
            noiDungChiTiet: `<b> Thông tin hóa đơn: </b> <br /> Mã hóa đơn: ${maHoaDon}  <br />Ngày lập: ${format(
                new Date(ngaylapHoaDonDB),
                'dd/MM/yyyy HH:mm'
            )} <br /> Khách hàng: ${txtKhachHang}  <br /> Tổng tiền:  ${Intl.NumberFormat('vi-VN').format(
                hoadon?.tongTienHangChuaChietKhau
            )} <br /> Chiết khấu hàng:  ${Intl.NumberFormat('vi-VN').format(hoadon?.tongChietKhauHangHoa)}
            <br /> Giảm giá hóa đơn:  ${Intl.NumberFormat('vi-VN').format(
                hoadon?.tongGiamGiaHD
            )}  <br /> <b> Thông tin chi tiết: </b> ${sDetails}`,
            loaiNhatKy: 1
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const saveDiarySoQuy = async (maHoaDon: string, quyHD: QuyHoaDonDto) => {
        let ptThanhToan = '';
        const itemMat = quyHD?.quyHoaDon_ChiTiet?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.TIEN_MAT);
        if ((itemMat?.length ?? 0) > 0) {
            ptThanhToan += 'Tiền mặt, ';
        }
        const itemCK = quyHD?.quyHoaDon_ChiTiet?.filter(
            (x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN
        );
        if ((itemCK?.length ?? 0) > 0) {
            ptThanhToan += 'Chuyển khoản, ';
        }
        const itemPos = quyHD?.quyHoaDon_ChiTiet?.filter((x) => x.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE);
        if ((itemPos?.length ?? 0) > 0) {
            ptThanhToan += 'POS';
        }
        ptThanhToan = utils.Remove_LastComma(ptThanhToan);
        const diary = {
            idChiNhanh: idChiNhanh,
            noiDung: `Thêm mới phiếu thu ${quyHD?.maHoaDon} cho hóa đơn ${maHoaDon}`,
            chucNang: 'Thêm mới phiếu thu',
            noiDungChiTiet: `<b> Chi tiết phiếu thu: </b> <br /> Mã phiếu thu: ${
                quyHD?.maHoaDon
            }  <br /> Ngày lập: ${format(new Date(quyHD?.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')} <br /> Khách hàng: ${
                quyHD?.tenNguoiNop
            }  <br /> Tổng tiền:  ${Intl.NumberFormat('vi-VN').format(
                quyHD?.tongTienThu
            )} <br /> Phương thức thanh toán: ${ptThanhToan} `,
            loaiNhatKy: 1
        } as CreateNhatKyThaoTacDto;
        nhatKyHoatDongService.createNhatKyThaoTac(diary);
    };

    const checkIsChuyenKhoan = (lstQCT_After: QuyChiTietDto[]) => {
        // neu tienmat/pos --> taohoaon + pt
        // else ck= qrcode --> qrcode baokim
        if (lstQCT_After?.length === 1) {
            if (lstQCT_After[0].hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN) {
                return true;
            }
        }
        return false;
    };

    const saveHoaDonToDB = async (trangThai: number) => {
        // assign again STT of cthd before save
        const dataSave = { ...hoadon };
        dataSave?.hoaDonChiTiet?.map((x: PageHoaDonChiTietDto, index: number) => {
            x.stt = index + 1;
        });
        const hodaDonDB = await HoaDonService.CreateHoaDon(dataSave);
        if (hodaDonDB != null) {
            // update again KH_Checkin: vì có thể ngayLapHoaDon bị thay đổi --> cập nhật lại ngày checkin
            const inputCheckIn: KHCheckInDto = {
                id: idCheckInUpdate,
                idKhachHang: hoadon?.idKhachHang as unknown as string,
                dateTimeCheckIn: hoadon?.ngayLapHoaDon,
                idChiNhanh: hoadon?.idChiNhanh as unknown as string,
                trangThai: trangThai,
                ghiChu: ''
            };
            if (
                !utils.checkNull(inputCheckIn?.id) &&
                !utils.checkNull(inputCheckIn?.idKhachHang) &&
                inputCheckIn.idKhachHang !== Guid.EMPTY
            ) {
                await CheckinService.UpdateCustomerCheckIn(inputCheckIn);
                await CheckinService.Update_IdHoaDon_toCheckInHoaDon(idCheckInUpdate, hodaDonDB.id);
            }

            await saveDiaryHoaDon(hodaDonDB?.maHoaDon, hodaDonDB?.ngayLapHoaDon);
            return hodaDonDB;
        }
        return null;
    };

    const savePhieuThuDB = async (hodaDonDB: HoaDonDto, lstQCT_After: QuyChiTietDto[]) => {
        const tongThu = lstQCT_After.reduce((currentValue: number, item) => {
            return currentValue + item.tienThu;
        }, 0);
        let quyHD = new QuyHoaDonDto({});
        if (tongThu > 0) {
            quyHD = new QuyHoaDonDto({
                idChiNhanh: utils.checkNull(chiNhanhCurrent?.id) ? idChiNhanh : chiNhanhCurrent?.id,
                idLoaiChungTu: LoaiChungTu.PHIEU_THU,
                ngayLapHoaDon: hodaDonDB.ngayLapHoaDon,
                tongTienThu: tongThu,
                noiDungThu: hoadon?.ghiChuHD
            });
            lstQCT_After = lstQCT_After.filter((x: QuyChiTietDto) => x.tienThu > 0);
            // assign idHoadonLienQuan, idKhachHang for quyCT
            lstQCT_After.map((x: QuyChiTietDto) => {
                x.idHoaDonLienQuan = hodaDonDB.id;
                x.idKhachHang = hoadon.idKhachHang == Guid.EMPTY ? null : hoadon.idKhachHang;
                x.maHoaDonLienQuan = hodaDonDB.maHoaDon;
            });
            quyHD.quyHoaDon_ChiTiet = lstQCT_After;
            const dataPT = await SoQuyServices.CreateQuyHoaDon(quyHD); // todo hoahong NV hoadon
            quyHD.maHoaDon = dataPT?.maHoaDon;
            quyHD.tenNguoiNop = hoadon.tenKhachHang; // used to print qrCode
            await saveDiarySoQuy(hodaDonDB?.maHoaDon, quyHD);
        }
        setObjAlert({
            show: true,
            type: 1,
            mes: 'Thanh toán hóa đơn thành công'
        });
        await GetDataPrint(hodaDonDB.maHoaDon, hodaDonDB?.ngayLapHoaDon, quyHD);
    };

    useEffect(() => {
        const invoiceHubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL + 'invoiceHub')
            .build();

        invoiceHubConnection.start().then(() => console.log('Connected to InvoiceHub'));

        invoiceHubConnection.on('ThongBaoGiaDich_fromBaoKim', async (data: IResponseThongBaoGiaoDich) => {
            console.log('ThongBaoGiaDich_fromBaoKim ', data);
        });

        return () => {
            invoiceHubConnection.off('ThongBaoGiaDich_fromBaoKim');
            invoiceHubConnection.stop();
        };
    }, []);

    const GuiTraLaiDuLieu = async (data: IResponseThongBaoGiaoDich, idHoaDon: string) => {
        await BaoKimPaymentService.GuiLaiThongTinGiaoDich(data, idHoaDon);
    };

    // click thanh toan---> chon hinh thucthanhtoan--->   luu hoadon + phieuthu
    const saveHoaDon = async () => {
        setShowDetail(false);
        setClickSave(true);

        const check = await checkSave();
        if (!check) {
            setClickSave(false);
            return;
        }

        // assign again qct if tra thua tien
        const lstQCT_After = SoQuyServices.AssignAgainQuyChiTiet(lstQuyCT, sumTienKhachTra, hoadon?.tongThanhToan ?? 0);
        const checkCK = checkIsChuyenKhoan(lstQCT_After);
        const hodaDonDB = await saveHoaDonToDB(TrangThaiCheckin.COMPLETED);
        if (hodaDonDB != null) {
            await savePhieuThuDB(hodaDonDB, lstQCT_After);
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Thanh toán hóa đơn thành công'
            });
        }
        // reset after save
        ResetState_AfterSave();
        await RemoveCache();
    };

    const Genarate_QRCodeBaoKim = async () => {
        const data = await BaoKimPaymentService.CreateQRCode();
        setQRCodeBank(data);
        setIsShowQRCode(true);
        return data;
    };

    const onClose_QRCodeBaoKim = () => {
        setIsShowQRCode(false);
        setClickSave(false);
    };

    const ResetState_AfterSave = () => {
        setClickSave(false);
        setIsShowQRCode(false);
        setIdCheckInUpdate('');
        setQRCodeBank({} as IBankInfor);

        setHoaDonChiTiet([]);
        setLstQuyCT([new QuyChiTietDto({ hinhThucThanhToan: HINH_THUC_THANH_TOAN.TIEN_MAT })]);
        setHoaDon(
            new PageHoaDonDto({
                id: Guid.create().toString(),
                idKhachHang: null,
                idChiNhanh: idChiNhanh,
                tenKhachHang: 'Khách lẻ'
            })
        );
        setCusChosing({
            ...cusChosing,
            id: '',
            maKhachHang: 'KL',
            tenKhachHang: 'Khách lẻ',
            tongTichDiem: 0,
            avatar: ''
        } as CreateOrEditKhachHangDto);
    };

    const GetDataPrint = async (mahoadon = '', ngayLapHD = '', quyHD: QuyHoaDonDto) => {
        const chinhanhPrint = await getInforChiNhanh_byID(idChiNhanh ?? '');
        const tempMauIn = await MauInServices.GetContentMauInMacDinh(1, 1);
        const allCongTy = await cuaHangService.GetAllCongTy({} as PagedRequestDto);
        let congty = {} as CuaHangDto;
        if (allCongTy.length > 0) {
            congty = allCongTy[0];
        }
        DataMauIn.chinhanh = chinhanhPrint;
        DataMauIn.congty = congty;
        DataMauIn.congty.logo = uploadFileService.GoogleApi_NewLink(congty?.logo);
        DataMauIn.hoadon = hoadon;
        DataMauIn.hoadon.maHoaDon = mahoadon;
        DataMauIn.hoadon.ngayLapHoaDon = ngayLapHD; // get ngaylapHD from DB (after add hours/minutes/seconds)
        DataMauIn.hoadon.daThanhToan = quyHD?.tongTienThu;
        DataMauIn.hoadon.conNo = hoadon.tongThanhToan - quyHD?.tongTienThu;
        DataMauIn.hoadonChiTiet = hoaDonChiTiet;
        DataMauIn.khachhang = {
            maKhachHang: hoadon?.maKhachHang,
            tenKhachHang: hoadon?.tenKhachHang,
            soDienThoai: hoadon?.soDienThoai
        } as KhachHangItemDto;
        DataMauIn.phieuthu = quyHD;

        let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
        newHtml = DataMauIn.replaceChiNhanh(newHtml);
        newHtml = DataMauIn.replaceHoaDon(newHtml);
        newHtml = await DataMauIn.replacePhieuThuChi(newHtml);
        DataMauIn.Print(newHtml);
    };

    // thêm 2 nút điều hướng cho phần cuộn ngang
    const containerRef = useRef<HTMLUListElement>(null);
    const [isScrollable, setIsScrollable] = useState<boolean>(false);

    const handleNextClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 150;
        }
    };

    const handlePrevClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 150;
        }
    };
    const handleScroll = () => {
        if (containerRef.current) {
            setIsScrollable(containerRef.current.scrollWidth > containerRef.current.clientWidth);
        }
    };

    // xử lý next và prev khi cuộn dọc
    const handleWheel = (event: React.WheelEvent<HTMLUListElement>) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += event.deltaY;
        }
    };

    useEffect(() => {
        const containerElement = containerRef.current;
        if (containerElement) {
            handleScroll();

            const resizeObserver = new ResizeObserver(handleScroll);
            resizeObserver.observe(containerElement);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [horizontalLayout]);

    // start: page thanhtoan new
    const [showDetail, setShowDetail] = useState(false);
    const handleShowDetail = () => {
        setShowDetail(!showDetail);
        setIsExpandShoppingCart(false);
    };

    const changeHinhThucThanhToan = (item: ISelect) => {
        const hinhThucNew = item?.value as number;
        let hinhThucOld = HINH_THUC_THANH_TOAN.TIEN_MAT;
        if (lstQuyCT.length > 0) {
            hinhThucOld = lstQuyCT[0].hinhThucThanhToan;
        }

        // mat --> ck,pos
        if (hinhThucOld === HINH_THUC_THANH_TOAN.TIEN_MAT && hinhThucOld !== hinhThucNew) {
            const accDefault = allAccountBank?.filter((x: TaiKhoanNganHangDto) => x.isDefault);
            let accFirst: TaiKhoanNganHangDto = {} as TaiKhoanNganHangDto;
            if (accDefault.length > 0) {
                accFirst = accDefault[0];
            } else {
                if (allAccountBank?.length > 0) {
                    accFirst = allAccountBank[0];
                }
            }

            setLstQuyCT(
                lstQuyCT.map((itemCT: QuyChiTietDto) => {
                    return {
                        ...itemCT,
                        hinhThucThanhToan: hinhThucNew,
                        sHinhThucThanhToan: item?.text,
                        idTaiKhoanNganHang: accFirst?.id,
                        tenNganHang: accFirst?.tenNganHang,
                        tenChuThe: accFirst?.tenChuThe,
                        soTaiKhoan: accFirst?.soTaiKhoan,
                        maPinNganHang: accFirst?.maPinNganHang
                    };
                })
            );

            setTaiKhoanNganHang({
                id: accFirst?.id,
                soTaiKhoan: accFirst?.soTaiKhoan,
                tenRutGon: accFirst.tenRutGon,
                tenTaiKhoan: accFirst?.tenChuThe,
                bin: accFirst?.maPinNganHang
            });
        } else {
            // only change hinhthucTT
            setLstQuyCT(
                lstQuyCT.map((itemCT: QuyChiTietDto) => {
                    return {
                        ...itemCT,
                        hinhThucThanhToan: hinhThucNew
                    };
                })
            );
        }
    };

    // const updateTongThanhToan_for

    useEffect(() => {
        // if (!afterRender.current) return;
        const hinhThucTT = lstQuyCT.length === 1 ? lstQuyCT[0].hinhThucThanhToan : 0;
        setLstQuyCT(
            lstQuyCT.map((itemCT: QuyChiTietDto) => {
                if (itemCT.hinhThucThanhToan === hinhThucTT) {
                    return {
                        ...itemCT,
                        tienThu: hoadon.tongThanhToan
                    };
                } else {
                    return { ...itemCT };
                }
            })
        );
        setSumTienKhachTra(hoadon?.tongThanhToan ?? 0);
        setTienThuaTraKhach(0);

        if (isExpandShoppingCart) {
            // update cacheHD
        }
    }, [hoadon.tongThanhToan]);

    // end thanhtoan new

    //QR
    const [qrCode, setQRCode] = useState('');
    const [allAccountBank, setAllAccountBank] = useState<TaiKhoanNganHangDto[]>([]);
    const [taiKhoanNganHang, setTaiKhoanNganHang] = useState<SuggestTaiKhoanNganHangQrDto>({
        id: null,
        bin: '',
        soTaiKhoan: '',
        tenRutGon: '',
        tenTaiKhoan: ''
    });
    const GetAllTaiKhoanNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount(idChiNhanh as undefined);
        setAllAccountBank(data?.filter((x) => x.trangThai === 1));
    };

    const changeTaiKhoanNganHang = async (item: TaiKhoanNganHangDto) => {
        setTaiKhoanNganHang({
            id: item?.id,
            soTaiKhoan: item?.soTaiKhoan,
            tenRutGon: item?.tenRutGon,
            tenTaiKhoan: item?.tenChuThe,
            bin: item?.maPinNganHang
        });
        setLstQuyCT(
            lstQuyCT.map((itemCT: QuyChiTietDto) => {
                if (
                    itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.CHUYEN_KHOAN ||
                    itemCT.hinhThucThanhToan === HINH_THUC_THANH_TOAN.QUYET_THE
                ) {
                    return {
                        ...itemCT,
                        idTaiKhoanNganHang: item?.id,
                        soTaiKhoan: item?.soTaiKhoan,
                        tenChuThe: item?.tenChuThe,
                        tenNganHang: item?.tenNganHang,
                        tenRutGon: item?.tenRutGon,
                        maPinNganHang: item?.maPinNganHang
                    };
                } else {
                    return { ...itemCT };
                }
            })
        );
    };

    useEffect(() => {
        GetAllTaiKhoanNganHang();
    }, [chiNhanhCurrent?.id]);
    useEffect(() => {
        genarateQrCode();
    }, [hoadon.tongThanhToan, taiKhoanNganHang]);

    const genarateQrCode = async () => {
        if (!utils.checkNull(taiKhoanNganHang.id)) {
            const accountBank: TaiKhoanNganHangDto = {
                id: taiKhoanNganHang?.id as unknown as string,
                soTaiKhoan: taiKhoanNganHang?.soTaiKhoan,
                tenChuThe: taiKhoanNganHang?.tenTaiKhoan,
                maPinNganHang: taiKhoanNganHang?.bin
            } as TaiKhoanNganHangDto;
            const qrCode = await TaiKhoanNganHangServices.GetQRCode(accountBank, hoadon.tongThanhToan);
            setQRCode(qrCode);
        } else {
            setQRCode('');
        }
    };
    //
    return (
        <>
            <QRCodeBaoKim
                isShowModal={isShowQRCode}
                objUpDate={qrCodeBank}
                onClose={onClose_QRCodeBaoKim}
                onOK={() => console.log('ok payment')}
            />
            <ThongBaoGiaoDich
                isShowModal={isGiaoDichOK}
                onClose={() => setIsGiaoDichOK(false)}
                onOK={() => console.log('ok trans')}
            />
            <ListNhanVienDataContext.Provider value={allNhanVien}>
                <ModalAddCustomerCheckIn
                    typeForm={1}
                    idUpdate={idCheckInUpdate}
                    isNew={isAddNewCheckIn}
                    isShowModal={isShowModalCheckIn}
                    onOK={saveCheckInOK}
                    onClose={() => setIsShowModalCheckIn(false)}
                />
            </ListNhanVienDataContext.Provider>
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus}
                onCancel={() => setIsShowModalAddCus(false)}
                onOk={changeCustomer}
                title="Thêm mới khách hàng"
                formRef={newCus}
            />
            <HoaHongNhanVienDichVu
                isNew={true}
                iShow={propNVThucHien.isShow}
                itemHoaDonChiTiet={propNVThucHien.item}
                onSaveOK={AgreeNVThucHien}
                onClose={() => setPropNVThucHien({ ...propNVThucHien, isShow: false })}
            />
            <ModalEditChiTietGioHang
                formType={1}
                isShow={isShowEditGioHang}
                hoadonChiTiet={hoaDonChiTiet.filter((x) => x.id === idCTHDChosing)}
                handleSave={AgreeGioHang}
                handleClose={() => setIsShowEditGioHang(false)}
            />
            <ConfirmDelete
                isShow={inforDelete.show}
                title={inforDelete.title}
                mes={inforDelete.mes}
                onOk={onClickConfirmDelete}
                onCancel={() => setinforDelete({ ...inforDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <Grid
                container
                className="page-ban-hang"
                spacing={2}
                width={'100%'} // width={'100%'}: khong duoc xoa dong nay: fix loi MUI tự động set width calc(100% + 16px)
                marginTop={showDetail ? '-24px' : '24px'}
                ml="0"
                sx={{
                    height: '100%',
                    '& > div:not(.normal)': {
                        paddingTop: '0!important'
                    }
                }}>
                {!showDetail ? (
                    <Grid
                        item
                        container
                        md={7}
                        sm={7}
                        xs={12}
                        spacing={2}
                        width={'100%'}
                        height="fit-content"
                        marginTop={window.screen.width >= 900 ? (horizontalLayout ? '-95px' : '-24px') : '0px'}
                        paddingBottom="0"
                        bgcolor="#F8F8F8">
                        <Grid
                            item
                            md={horizontalLayout ? 12 : 4}
                            width={'100%'}
                            sx={{
                                // paddingLeft: '0!important',
                                display: 'flex',
                                flexDirection: 'column',
                                maxWidth: '100vh',
                                paddingRight: '16px'
                            }}>
                            {horizontalLayout && (
                                <TextField
                                    fullWidth
                                    sx={{
                                        borderColor: '#CFD3D4!important',
                                        borderWidth: '1px!important',
                                        maxWidth: { lg: '50%', md: '40%' },
                                        mr: '24px',
                                        pl: 2,
                                        bgcolor: 'transparent',
                                        boxShadow: ' 0px 20px 100px 0px #0000000D',
                                        maxHeight: '37px',
                                        marginLeft: 'auto',
                                        '& .MuiInputBase-root': {
                                            bgcolor: '#fff'
                                        },
                                        '& input': {
                                            color: '#3D475C!important'
                                        }
                                    }}
                                    size="small"
                                    className="text-search"
                                    variant="outlined"
                                    type="search"
                                    placeholder="Tìm dịch vụ"
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlinedIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                            <Box
                                mt={horizontalLayout ? '8px' : '0px'}
                                sx={{
                                    scrollBehavior: 'smooth',
                                    backgroundColor: horizontalLayout ? 'transparent' : '#fff',
                                    borderRadius: '8px',
                                    boxShadow: horizontalLayout ? 'unset' : ' 0px 20px 100px 0px #0000000D',
                                    padding: '16px',
                                    height: horizontalLayout ? 'unset' : '100vh',
                                    overflowX: 'hidden',
                                    maxHeight: horizontalLayout ? 'unset' : '88.5vh',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '8px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        bgcolor: 'var(--color-bg)'
                                    }
                                }}>
                                <Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography
                                            variant="h3"
                                            fontSize="16px"
                                            color="#4C4B4C"
                                            fontWeight="700"
                                            onClick={() => choseLoaiHang(2)}>
                                            Nhóm dịch vụ
                                        </Typography>
                                    </Box>
                                    <List
                                        onScroll={handleScroll}
                                        ref={containerRef}
                                        onWheel={handleWheel}
                                        sx={{
                                            columnGap: '12px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            whiteSpace: 'nowrap',
                                            overflowX: 'auto',
                                            scrollBehavior: 'smooth',
                                            '&::-webkit-scrollbar': {
                                                width: '7px',
                                                height: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                borderRadius: '8px'
                                            },
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(0,0,0,0.1)'
                                        }}>
                                        <ListItem
                                            component="a"
                                            className="list-item-nhomhanghoa"
                                            onClick={() => choseLoaiHang(2)}
                                            sx={{
                                                gap: '6px',
                                                padding: '4px 8px',
                                                bgcolor: idNhomHang == '' ? 'var( --color-main)' : '#ebe9e9cc',
                                                minWidth: horizontalLayout ? '100px' : 'unset',
                                                maxWidth: horizontalLayout ? '100px' : 'unset'
                                            }}>
                                            <ListItemText
                                                className="ten-nhom-hang"
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        color: idNhomHang == '' ? 'white!important' : 'black!important'
                                                    }
                                                }}>
                                                Tất cả
                                            </ListItemText>
                                        </ListItem>
                                        {nhomDichVu.map((nhomDV, index) => (
                                            <ListItem
                                                component="a"
                                                className="list-item-nhomhanghoa"
                                                key={index}
                                                onClick={() => choseNhomDichVu(nhomDV)}
                                                sx={{
                                                    gap: '6px',
                                                    bgcolor:
                                                        idNhomHang == (nhomDV?.id as unknown as string)
                                                            ? 'rgba(0,0,0,0.3)'
                                                            : '#ebe9e9cc',
                                                    minWidth: horizontalLayout ? '100px' : 'unset'
                                                    // maxWidth: horizontalLayout ? '200px' : 'unset',
                                                }}>
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: '0',
                                                        position: 'relative',
                                                        '& path': {
                                                            fill: nhomDV.color ?? '#c2c9d6'
                                                        }
                                                    }}>
                                                    {/* <IconDv /> */}
                                                </ListItemIcon>
                                                <ListItemText className="ten-nhom-hang" title={nhomDV.tenNhomHang}>
                                                    {nhomDV.tenNhomHang}
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                        {nhomHangHoa.map((nhomHH, index) => (
                                            <ListItem
                                                component="a"
                                                className="list-item-nhomhanghoa"
                                                href={'#' + nhomHH.id}
                                                key={index}
                                                sx={{
                                                    gap: '6px',
                                                    bgcolor:
                                                        idNhomHang == (nhomHH?.id as unknown as string)
                                                            ? 'rgba(0,0,0,0.3)'
                                                            : '#ebe9e9cc',
                                                    minWidth: horizontalLayout ? '100px' : 'unset'
                                                    // maxWidth: horizontalLayout ? '200px' : 'unset',
                                                }}
                                                onClick={() => choseNhomDichVu(nhomHH)}>
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: '0',
                                                        position: 'relative',
                                                        '& path': {
                                                            fill: nhomHH.color ?? '#c2c9d6'
                                                        }
                                                    }}>
                                                    {/* <IconDv /> */}
                                                </ListItemIcon>
                                                <ListItemText className="ten-nhom-hang" title={nhomHH.tenNhomHang}>
                                                    {nhomHH.tenNhomHang}
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={horizontalLayout ? 12 : 8} sx={{ marginTop: '-58px' }} width={'100%'}>
                            <Box display="flex" flexDirection="column">
                                {!horizontalLayout && (
                                    <TextField
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff',
                                            borderColor: '#CFD3D4!important',
                                            borderWidth: '1px!important',

                                            boxShadow: ' 0px 20px 100px 0px #0000000D',

                                            margin: 'auto',
                                            '& input': {
                                                color: '#3D475C!important'
                                            }
                                        }}
                                        size="small"
                                        className="text-search"
                                        variant="outlined"
                                        type="search"
                                        placeholder="Tìm dịch vụ"
                                        value={txtSearch}
                                        onChange={(event) => {
                                            setTxtSearch(event.target.value);
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchOutlinedIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="24px"
                                    padding={2}
                                    marginTop="22px"
                                    sx={{
                                        width: '100%',
                                        backgroundColor: horizontalLayout ? 'transparent' : '#fff',
                                        borderRadius: '8px',
                                        height:
                                            horizontalLayout && innerHeight > 600
                                                ? '75vh'
                                                : horizontalLayout && innerHeight < 605
                                                ? '32vh'
                                                : '88.5vh',
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                        scrollBehavior: 'smooth',
                                        '&::-webkit-scrollbar': {
                                            width: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            borderRadius: '8px'
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            bgcolor: 'var(--color-bg)'
                                        }
                                    }}>
                                    {listProduct.map((nhom: IHangHoaGroupTheoNhomDto, index: number) => (
                                        <Box key={index} id={nhom.idNhomHangHoa}>
                                            <Typography
                                                variant="h4"
                                                fontSize="16px"
                                                color="#000"
                                                pt="5px"
                                                fontWeight="700"
                                                marginBottom="11px">
                                                {nhom.tenNhomHang}
                                            </Typography>

                                            <Grid container item spacing={1.5} width={'100%'}>
                                                {nhom.hangHoas.map((item) => (
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        sm={6}
                                                        md={horizontalLayout ? 4 : 6}
                                                        lg={horizontalLayout ? 3 : 4}
                                                        key={item.id}>
                                                        <Stack
                                                            spacing={2}
                                                            height={'100%'}
                                                            padding="8px 12px"
                                                            // display="flex"
                                                            flexDirection="column"
                                                            justifyContent="space-between"
                                                            gap="8px"
                                                            borderRadius="4px"
                                                            sx={{
                                                                border: '1px solid transparent',
                                                                cursor: 'pointer',
                                                                transition: '.4s',
                                                                backgroundColor: 'var(--color-bg)',
                                                                '&:hover': {
                                                                    borderColor: 'var(--color-main)'
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                choseChiTiet(item, index);
                                                            }}>
                                                            <span
                                                                title={item.tenHangHoa}
                                                                style={{
                                                                    fontSize: 'var(--font-size-main)',
                                                                    fontWeight: '600',
                                                                    color: '#333233',
                                                                    // display: '-webkit-box',
                                                                    // WebkitBoxOrient: 'vertical',
                                                                    // WebkitLineClamp: 2,
                                                                    // maxHeight: '32px',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                {item.tenHangHoa}
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '13px',
                                                                    color: '#333233'
                                                                }}>
                                                                {Intl.NumberFormat('vi-VN').format(
                                                                    item.giaBan as number
                                                                )}
                                                            </span>
                                                        </Stack>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid
                        item
                        md={7}
                        sm={7}
                        xs={12}
                        className="normal"
                        sx={{
                            pt: '0!important',
                            marginTop: '-24px!important'
                        }}>
                        <DetailHoaDon
                            listAccountBank={allAccountBank}
                            idAccounBank={taiKhoanNganHang?.id ?? ''}
                            toggleDetail={handleShowDetail}
                            hinhThucTT={lstQuyCT.length === 1 ? lstQuyCT[0].hinhThucThanhToan : 0}
                            tongTienHang={hoadon?.tongTienHang}
                            ptGiamGiaHD_Parent={hoadon?.pTGiamGiaHD}
                            tongGiamGiaHD_Parent={hoadon?.tongGiamGiaHD}
                            onChangeQuyChiTiet={assignThongTinThanhToan}
                            onChangeHoaDon={editInforHoaDon_atPayment}
                            onChangeGhiChuHD={onChangeGhiChuHD_atPayment}
                            onChangeTaiKhoanNganHang={changeTaiKhoanNganHang}
                            onClickThanhToan={saveHoaDon}
                        />
                    </Grid>
                )}

                <Grid item xs={12} sm={5} md={5} sx={{ paddingRight: '0' }}>
                    <Stack
                        sx={{
                            mt: window.screen.width >= 768 ? (showDetail ? '-21px' : '-95px') : '0px',
                            backgroundColor: '#fff',
                            height: window.screen.width >= 768 ? '100vh' : 'auto',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            '&::after': {
                                content: "''",
                                pointerEvents: 'none',
                                position: 'absolute',
                                left: '0',
                                width: '100%',
                                bottom: '0px',
                                bgcolor: '#fff'
                            }
                        }}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderBottom: '1px solid #F2F2F2',
                                paddingBottom: '16px'
                            }}>
                            <Box display="flex" gap="8px" alignItems="center">
                                {utils.checkNull(cusChosing?.id) || cusChosing?.id === Guid.EMPTY ? (
                                    <Avatar sx={{ width: 40, height: 40 }} />
                                ) : utils.checkNull(cusChosing?.avatar) ? (
                                    <BadgeFistCharOfName
                                        firstChar={utils.getFirstLetter(cusChosing?.tenKhachHang ?? '')}
                                    />
                                ) : (
                                    <Avatar sx={{ width: 40, height: 40 }} src={cusChosing?.avatar} />
                                )}

                                <Box
                                    sx={{ cursor: 'pointer' }}
                                    title="Thay đổi khách hàng"
                                    onClick={() => showModalCheckIn(false)}>
                                    <Typography variant="subtitle2" color="#3D475C">
                                        {hoadon?.tenKhachHang}
                                    </Typography>
                                    <Typography variant="subtitle2" fontSize="12px" color="#525F7A">
                                        {hoadon?.soDienThoai}
                                    </Typography>
                                </Box>

                                <Box sx={{ marginLeft: 'auto' }}>
                                    <Stack direction="row" spacing={'10px'}>
                                        <Stack
                                            alignItems={'end'}
                                            sx={{
                                                '& fieldset': {
                                                    border: 'none',
                                                    fontSize: '13px'
                                                },
                                                ' & .MuiInputBase-root': {
                                                    marginTop: '-5px'
                                                }
                                            }}>
                                            <DatePickerRequireCustom
                                                props={{
                                                    width: window.screen.width > 900 ? '85%' : '100%',
                                                    size: 'small'
                                                }}
                                                maxDate={new Date()}
                                                defaultVal={hoadon?.ngayLapHoaDon}
                                                handleChangeDate={changeNgayLapHoaDon}
                                            />
                                        </Stack>
                                        <Add
                                            onClick={() => showModalCheckIn(true)}
                                            sx={{
                                                color: '#1976d2',
                                                display: !abpCustom.isGrandPermission('Pages.CheckIn.Create')
                                                    ? 'none'
                                                    : ''
                                            }}
                                            titleAccess="Thêm khách check in"
                                        />
                                        <div ref={ref}>
                                            <Badge
                                                badgeContent={allInvoiceWaiting?.length ?? 0}
                                                color="secondary"
                                                sx={{ position: 'relative' }}>
                                                <ShoppingCartIcon
                                                    sx={{ color: '#1976d2' }}
                                                    titleAccess="Hóa đơn chờ"
                                                    onClick={showAllInvoiceWaiting}
                                                />

                                                <Stack
                                                    width={190}
                                                    spacing={1}
                                                    overflow={'auto'}
                                                    maxHeight={500}
                                                    sx={{
                                                        display: isExpandShoppingCart ? '' : 'none',
                                                        position: 'absolute',
                                                        marginLeft: '-160px',
                                                        backgroundColor: 'white',
                                                        border: '1px solid #cccc',
                                                        borderRadius: '4px',
                                                        top: '20px',
                                                        zIndex: 2
                                                    }}>
                                                    <Stack sx={{ backgroundColor: 'antiquewhite' }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                textAlign: 'center',
                                                                borderBottom: '1px solid #cccc',
                                                                padding: '8px'
                                                            }}>
                                                            Hóa đơn chờ
                                                        </Typography>
                                                        <CloseOutlinedIcon
                                                            titleAccess="Xóa tất cả"
                                                            onClick={() => {
                                                                setIdHoaDonChosing(null);
                                                                setinforDelete(
                                                                    new PropConfirmOKCancel({
                                                                        show: true,
                                                                        title: 'Xác nhận xóa',
                                                                        mes: `Bạn có chắc chắn muốn tất cả xóa hóa đơn chờ  không`
                                                                    })
                                                                );
                                                            }}
                                                            sx={{
                                                                position: 'absolute',
                                                                right: '8px',
                                                                top: '8px',
                                                                width: 16,
                                                                height: 16,
                                                                color: 'red',
                                                                '&:hover': {
                                                                    filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                                                }
                                                            }}
                                                        />
                                                    </Stack>

                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        variant="standard"
                                                        placeholder="Tìm hóa đơn"
                                                        value={txtSearchInvoiceWaiting}
                                                        onChange={(e) => setTxtSearchInvoiceWaiting(e.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchOutlinedIcon />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                    <Stack>
                                                        {lstSearchInvoiceWaiting?.map(
                                                            (item: PageHoaDonDto, index: number) => (
                                                                <Stack sx={{ position: 'relative' }} key={index}>
                                                                    <CloseOutlinedIcon
                                                                        onClick={() => {
                                                                            setIdHoaDonChosing(item?.id);
                                                                            setinforDelete(
                                                                                new PropConfirmOKCancel({
                                                                                    show: true,
                                                                                    title: 'Xác nhận xóa',
                                                                                    mes: `Bạn có chắc chắn muốn xóa hóa đơn của  ${
                                                                                        item?.tenKhachHang
                                                                                    }  có tổng tiền  ${Intl.NumberFormat(
                                                                                        'vi-VN'
                                                                                    ).format(
                                                                                        item?.tongThanhToan
                                                                                    )}? không`
                                                                                })
                                                                            );
                                                                        }}
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            right: '8px',
                                                                            top: '8px',
                                                                            width: 16,
                                                                            height: 16,
                                                                            color: 'red',
                                                                            '&:hover': {
                                                                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Stack
                                                                        sx={{
                                                                            padding: '10px',
                                                                            borderBottom: '1px solid #ccc'
                                                                        }}
                                                                        onClick={() => onChoseInvoiceWaiting(item?.id)}>
                                                                        <Stack
                                                                            direction={'row'}
                                                                            spacing={1}
                                                                            alignItems={'center'}>
                                                                            <AssignmentIndOutlinedIcon
                                                                                sx={{
                                                                                    color: '#cccc',
                                                                                    width: '18px',
                                                                                    height: '18px'
                                                                                }}
                                                                            />
                                                                            <Typography
                                                                                variant="subtitle2"
                                                                                title={item?.tenKhachHang}>
                                                                                {item.tenKhachHang}
                                                                            </Typography>
                                                                        </Stack>
                                                                        {item?.soDienThoai && (
                                                                            <Stack
                                                                                direction={'row'}
                                                                                spacing={1}
                                                                                alignItems={'center'}>
                                                                                <PhoneOutlinedIcon
                                                                                    sx={{
                                                                                        color: '#cccc',
                                                                                        width: '18px',
                                                                                        height: '18px'
                                                                                    }}
                                                                                />
                                                                                <Typography
                                                                                    color="#999699"
                                                                                    variant="caption">
                                                                                    {item?.soDienThoai}
                                                                                </Typography>
                                                                            </Stack>
                                                                        )}

                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="600"
                                                                            color={'#d39987'}>
                                                                            {Intl.NumberFormat('vi-VN').format(
                                                                                item?.tongThanhToan
                                                                            )}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            )
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </Badge>
                                        </div>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                        {/* 1 row chi tiet */}
                        <Box
                            sx={{
                                scrollBehavior: 'smooth',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '7px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    borderRadius: '8px'
                                },
                                '&::-webkit-scrollbar-track': {
                                    bgcolor: 'var(--color-bg)'
                                }
                            }}>
                            {hoaDonChiTiet?.map((ct: PageHoaDonChiTietDto, index) => (
                                <Box
                                    padding={
                                        ct?.nhanVienThucHien !== undefined &&
                                        (ct?.nhanVienThucHien.length > 0 || (ct?.tienChietKhau ?? 0) > 0)
                                            ? '8px 0px'
                                            : '16px 0px'
                                    }
                                    borderBottom="1px solid #E0E4EB"
                                    key={index}>
                                    <Grid container>
                                        <Grid item md={12} xs={12} sm={12} lg={7}>
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                color="var(--color-main)"
                                                fontWeight="400"
                                                lineHeight="20px"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '1',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer'
                                                }}
                                                title={ct.tenHangHoa}
                                                onClick={() => showPopNhanVienThucHien(ct)}>
                                                {ct.tenHangHoa}
                                            </Typography>
                                            {/* nhan vien thuc hien */}
                                            {ct?.nhanVienThucHien !== undefined && ct?.nhanVienThucHien.length > 0 && (
                                                <>
                                                    <Box display="flex" alignItems="center" flexWrap="wrap" gap="8px">
                                                        {ct.nhanVienThucHien.map((nv, index3: number) => (
                                                            <Box
                                                                key={index3}
                                                                sx={{
                                                                    fontSize: '11px',
                                                                    lineHeight: '16px',
                                                                    color: '#4C4B4C',
                                                                    alignItems: 'center',
                                                                    maxWidth:
                                                                        ct.nhanVienThucHien !== undefined &&
                                                                        ct.nhanVienThucHien.length === 1
                                                                            ? '100%'
                                                                            : ct.nhanVienThucHien !== undefined &&
                                                                              ct.nhanVienThucHien.length > 2
                                                                            ? 'calc(50% - 23px)'
                                                                            : 'calc(50% - 4px)',
                                                                    backgroundColor: 'var(--color-bg)',
                                                                    padding: '4px 8px',
                                                                    gap: '4px',
                                                                    borderRadius: '100px',
                                                                    '& .remove-NV:hover img': {
                                                                        filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                                                    },
                                                                    display: index3 > 1 ? 'none' : 'flex',
                                                                    width: 'auto'
                                                                }}>
                                                                <Box
                                                                    sx={{
                                                                        width: '100%',
                                                                        whiteSpace: 'nowrap',
                                                                        textOverflow: 'ellipsis',
                                                                        overflow: 'hidden'
                                                                    }}
                                                                    title={nv.tenNhanVien}>
                                                                    {nv.tenNhanVien}
                                                                </Box>
                                                                <span
                                                                    className="remove-NV"
                                                                    style={{
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => RemoveNVThucHien(ct, nv)}>
                                                                    <img src={closeIcon} alt="close" />
                                                                </span>
                                                            </Box>
                                                        ))}
                                                        {ct.nhanVienThucHien.length > 2 ? (
                                                            <Box
                                                                sx={{
                                                                    fontSize: '10px',
                                                                    color: '#525F7A',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '100px',
                                                                    bgcolor: 'var(--color-bg)',
                                                                    cursor: 'pointer'
                                                                }}>
                                                                {ct.nhanVienThucHien.length - 2}+
                                                            </Box>
                                                        ) : undefined}
                                                    </Box>
                                                </>
                                            )}
                                        </Grid>
                                        <Grid
                                            item
                                            md={12}
                                            xs={12}
                                            sm={12}
                                            lg={5}
                                            mt={{ xs: 1, sm: 1, md: 1, lg: 0 }}
                                            pl={{ xs: 5, sm: 5, md: 5, lg: 0 }}>
                                            <Grid container justifyContent={'flex-end'}>
                                                <Stack width={'100%'} direction={'row'} justifyContent={'flex-end'}>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                gap: '8px',
                                                                color: '#000',
                                                                fontSize: '14px',
                                                                fontWeight: 500,

                                                                transition: '.4s',
                                                                '& .price': {
                                                                    // fontSize: '14px',
                                                                    color: 'var(--color-main)'
                                                                },
                                                                '& .price:hover': {
                                                                    cursor: 'pointer'
                                                                }
                                                            }}>
                                                            <Stack direction={'row'} spacing={1}>
                                                                <span>{ct.soLuong}</span>
                                                                <span
                                                                    style={{
                                                                        fontSize: '13px'
                                                                    }}>
                                                                    x
                                                                </span>
                                                            </Stack>
                                                            <Box>
                                                                <Box
                                                                    component="span"
                                                                    onClick={() => showPopChiTietGioHang(ct)}
                                                                    className="price">
                                                                    {Intl.NumberFormat('vi-VN').format(
                                                                        ct.donGiaTruocCK
                                                                    )}
                                                                </Box>
                                                                {ct?.tienChietKhau !== undefined &&
                                                                    ct?.tienChietKhau > 0 && (
                                                                        <Typography
                                                                            textAlign="center"
                                                                            variant="body1"
                                                                            color="#8492AE"
                                                                            fontSize="10px"
                                                                            fontStyle="italic">
                                                                            <span>Giảm</span>{' '}
                                                                            <span>
                                                                                {new Intl.NumberFormat('vi-VN').format(
                                                                                    ct?.tienChietKhau ?? 0
                                                                                )}
                                                                            </span>
                                                                        </Typography>
                                                                    )}
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <Box
                                                            justifyContent={'flex-end'}
                                                            sx={{
                                                                display: 'flex',
                                                                gap: '8px'
                                                            }}>
                                                            <span
                                                                style={{
                                                                    fontWeight: 500,
                                                                    fontSize: '14px'
                                                                }}>
                                                                {Intl.NumberFormat('vi-VN').format(
                                                                    ct?.thanhTienSauCK ?? 0
                                                                )}
                                                            </span>
                                                            <Button
                                                                sx={{
                                                                    minWidth: '20px',
                                                                    padding: '0',
                                                                    '&:hover svg': {
                                                                        filter: 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(3282%) hue-rotate(337deg) brightness(85%) contrast(105%)'
                                                                    }
                                                                }}>
                                                                <DeleteIcon
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        color: '#999699'
                                                                    }}
                                                                    onClick={() => {
                                                                        deleteChiTietHoaDon(ct);
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                        <Box marginTop="auto">
                            <Box pt="8px" display="none">
                                <Typography variant="h3" color="#333233" fontSize="14px" fontWeight="500" mb="8px">
                                    Mã giảm giá
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Nhập mã"
                                    value={hoadon?.ghiChuHD}
                                    onChange={(e) => setHoaDon({ ...hoadon, ghiChuHD: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VoucherIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <Button
                                                variant="text"
                                                sx={{
                                                    padding: '0',
                                                    transition: '.4s',
                                                    bgcolor: 'transparent!important',
                                                    color: '#4C4B4C',
                                                    '&:hover': {
                                                        color: 'var(--color-main)'
                                                    }
                                                }}>
                                                Áp dụng
                                            </Button>
                                        )
                                    }}
                                    sx={{ '& input': { fontSize: '14px' } }}
                                />
                            </Box>

                            <Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    pt="16px"
                                    pb="16px"
                                    borderRadius="12px"
                                    // paddingX="16px"
                                    bgcolor="#F9F9F9">
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6" fontSize="16px" fontWeight="700" color="#3B4758">
                                            Tổng thanh toán
                                        </Typography>
                                        <Typography variant="body1" fontWeight="700" fontSize="16px" color="#3B4758">
                                            {Intl.NumberFormat('vi-VN').format(hoadon?.tongThanhToan)}
                                        </Typography>
                                    </Box>
                                    <Box display="none" justifyContent="space-between">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Giảm giá
                                        </Typography>
                                        <Typography variant="caption" fontSize="12px" color="#3B4758">
                                            {Intl.NumberFormat('vi-VN').format(hoadon?.tongChietKhauHangHoa)}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="none"
                                        justifyContent="space-between"
                                        borderBottom="1px solid #CBADC2"
                                        pb="8px">
                                        <Typography variant="h6" fontSize="14px" color="#3B4758">
                                            Tổng giảm giá
                                        </Typography>
                                        <Typography variant="caption" fontSize="12px" color="#3B4758">
                                            {Intl.NumberFormat('vi-VN').format(hoadon?.tongChietKhauHangHoa)}
                                        </Typography>
                                    </Box>
                                    <Grid container justifyContent="space-between">
                                        <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                variant="body1"
                                                fontSize="14px"
                                                color="#3D475C"
                                                fontWeight="500">
                                                Tiền khách trả
                                            </Typography>
                                        </Grid>
                                        <Grid item xs="auto">
                                            {lstQuyCT.length > 1 ? (
                                                <Box
                                                    sx={{
                                                        mb: '8px',
                                                        display: 'flex',
                                                        gap: '16px',
                                                        '& .item': {
                                                            fontSize: '14px',
                                                            color: '#525F7A'
                                                        },
                                                        '& > div': {
                                                            display: 'flex',
                                                            gap: '5px'
                                                        }
                                                    }}>
                                                    {lstQuyCT.map((ctQuy: QuyChiTietDto, index3: number) => (
                                                        <Box key={index3}>
                                                            <Box className="label item">
                                                                {ctQuy.sHinhThucThanhToan}:
                                                            </Box>
                                                            <Box className="value item">
                                                                {new Intl.NumberFormat('vi-VN').format(ctQuy.tienThu)}
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <RadioGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    {AppConsts.hinhThucThanhToan.map((item, index) => (
                                                        <FormControlLabel
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '14px'
                                                                },

                                                                marginRight: index === 2 ? '0' : '16px'
                                                            }}
                                                            key={index}
                                                            label={item?.text}
                                                            checked={
                                                                lstQuyCT.length == 1 &&
                                                                lstQuyCT[0].hinhThucThanhToan === item.value
                                                            }
                                                            onChange={() => {
                                                                changeHinhThucThanhToan(item);
                                                            }}
                                                            control={<Radio value={item.value} size="small" />}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        </Grid>
                                        <Grid xs={12} item>
                                            <NumericFormat
                                                size="small"
                                                fullWidth
                                                value={sumTienKhachTra}
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                sx={{
                                                    '& input': {
                                                        textAlign: 'right',
                                                        fontWeight: '700',
                                                        color: '#3D475C',
                                                        fontSize: '16px',
                                                        padding: '14px'
                                                    }
                                                }}
                                                customInput={TextField}
                                                onChange={(event) => {
                                                    const arrQCT = lstQuyCT.map((itemQuy: QuyChiTietDto) => {
                                                        return {
                                                            ...itemQuy,
                                                            tienThu: utils.formatNumberToFloat(event.target.value)
                                                        };
                                                    });
                                                    assignThongTinThanhToan(arrQCT);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box
                                        display={tienThuaTraKhach != 0 ? 'flex' : 'none'}
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <Typography variant="h5" fontWeight="400" fontSize="14px" color="#3B4758">
                                            {tienThuaTraKhach > 0 ? 'Tiền thừa' : 'Tiên khách thiếu'}
                                        </Typography>
                                        <Typography variant="body1" fontWeight="700" fontSize="16px" color="#3B4758">
                                            {new Intl.NumberFormat('vi-VN').format(Math.abs(tienThuaTraKhach))}
                                        </Typography>
                                    </Box>
                                    {lstQuyCT[0].hinhThucThanhToan !== HINH_THUC_THANH_TOAN.TIEN_MAT && (
                                        <Stack>
                                            <AutocompleteAccountBank
                                                handleChoseItem={changeTaiKhoanNganHang}
                                                idChosed={
                                                    utils.checkNull(taiKhoanNganHang.id) ? '' : taiKhoanNganHang.id
                                                }
                                                listOption={allAccountBank}
                                            />
                                            {/* <Stack style={{ marginTop: '16px' }}>
                                                <BankAccount
                                                    lstBankAccount={allAccountBank}
                                                    idChosed={
                                                        utils.checkNull(taiKhoanNganHang.id) ? '' : taiKhoanNganHang.id
                                                    }
                                                    handleChoseItem={changeTaiKhoanNganHang}
                                                />
                                            </Stack> */}

                                            {/* {qrCode && (
                                                <img
                                                    src={qrCode}
                                                    style={{ width: '128px', height: '128px', marginTop: '8px' }}
                                                />
                                            )} */}
                                        </Stack>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'stretch',
                                        mt: '8px',
                                        gap: '8px'
                                    }}>
                                    <Button variant="outlined" sx={{ minWidth: 'unset' }} onClick={handleShowDetail}>
                                        <MoreHorizIcon sx={{ color: '#525F7A' }} />
                                    </Button>
                                    {clickSSave ? (
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: '#fff',
                                                textTransform: 'unset!important',
                                                backgroundColor: 'var(--color-main)!important',
                                                paddingY: '12px',
                                                transition: '.3s'
                                            }}>
                                            Đang lưu
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: '#fff',
                                                textTransform: 'unset!important',
                                                backgroundColor: 'var(--color-main)!important',
                                                paddingY: '12px',
                                                transition: '.3s',
                                                opacity: showDetail ? '0.2' : '1',
                                                pointerEvents: showDetail ? 'none' : 'all'
                                            }}
                                            className="btn-container-hover"
                                            onClick={saveHoaDon}>
                                            Thanh Toán
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};
export default observer(PageBanHang);
