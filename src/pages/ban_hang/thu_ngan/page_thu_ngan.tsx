import {
    Stack,
    Typography,
    Avatar,
    Grid,
    debounce,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    IconButton,
    CircularProgress,
    Chip
} from '@mui/material';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { useEffect, useRef, useState } from 'react';
import GroupProductService from '../../../services/product/GroupProductService';
import {
    IHangHoaGroupTheoNhomDto,
    ModelHangHoaDto,
    ModelNhomHangHoa,
    PagedProductSearchDto
} from '../../../services/product/dto';
import { IList } from '../../../services/dto/IList';
import ProductService from '../../../services/product/ProductService';
import khachHangService from '../../../services/khach-hang/khachHangService';
import { Guid } from 'guid-typescript';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import { NumericFormat } from 'react-number-format';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import PaymentsForm from './PaymentsForm';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';
import CreateOrEditCustomerDialog from '../../customer/components/create-or-edit-customer-modal';

import utils from '../../../utils/utils';
import { PropConfirmOKCancel, PropModal } from '../../../utils/PropParentToChild';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import { LoaiChungTu, TrangThaiCheckin } from '../../../lib/appconst';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import { format } from 'date-fns';
import MenuWithDataFromDB from '../../../components/Menu/MenuWithData_fromDB';
import { TypeSearchfromDB } from '../../../enum/TypeSearch_fromDB';
import { KhachHangDto } from '../../../services/khach-hang/dto/KhachHangDto';
import { dbDexie } from '../../../lib/dexie/dexieDB';
import CheckinService from '../../../services/check_in/CheckinService';
import { KHCheckInDto } from '../../../services/check_in/CheckinDto';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';
import ModalSuDungGDV from '../../goi_dich_vu/modal_sudung_gdv';
import ChiTietSuDungGDVDto from '../../../services/ban_hang/ChiTietSuDungGDVDto';
import Loading from '../../../components/Loading';
import ModalEditChiTietGioHang from './modal_edit_chitiet';
import HoaHongNhanVienDichVu from '../../nhan_vien_thuc_hien/hoa_hong_nhan_vien_dich_vu';
import NhanVienThucHienDto from '../../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import MauInServices from '../../../services/mau_in/MauInServices';
import cuaHangService from '../../../services/cua_hang/cuaHangService';
import { PagedRequestDto } from '../../../services/dto/pagedRequestDto';
import { CuaHangDto } from '../../../services/cua_hang/Dto/CuaHangDto';
import DataMauIn from '../../admin/settings/mau_in/DataMauIn';
import chiNhanhService from '../../../services/chi_nhanh/chiNhanhService';
import QuyHoaDonDto from '../../../services/so_quy/QuyHoaDonDto';
import uploadFileService from '../../../services/uploadFileService';
import { KhachHangItemDto } from '../../../services/khach-hang/dto/KhachHangItemDto';
import PopoverGiamGiaHD from '../../../components/Popover/GiamGiaHD';
import QuyChiTietDto from '../../../services/so_quy/QuyChiTietDto';

export type IPropsPageThuNgan = {
    txtSearch: string;
    loaiHoaDon: number;
    customerIdChosed: string;
    idChiNhanhChosed: string;

    idInvoiceWaiting?: string;
    idCheckIn?: string;
    arrIdNhomHangFilter?: string[];
    onSetActiveTabLoaiHoaDon: (idLoaiChungTu: number) => void;
    onAddHoaDon_toCache: () => void;
    onRemoveHoaDon_toCache: () => void;
};

export default function PageThuNgan(props: IPropsPageThuNgan) {
    const {
        txtSearch,
        loaiHoaDon,
        customerIdChosed,
        idChiNhanhChosed,
        idInvoiceWaiting,
        idCheckIn,
        arrIdNhomHangFilter,
        onSetActiveTabLoaiHoaDon,
        onAddHoaDon_toCache,
        onRemoveHoaDon_toCache
    } = props;
    const firstLoad = useRef(true);
    const firstLoad_changeLoaiHD = useRef(true);
    const firstLoad_changeIdInvoiceWaiting = useRef(true);
    const [anchorDropdownCustomer, setAnchorDropdownCustomer] = useState<null | HTMLElement>(null);
    const expandSearchCus = Boolean(anchorDropdownCustomer);
    const [anchorGiamGiaHD, setAnchorGiamGiaHD] = useState<null | HTMLElement | SVGElement>(null);
    const isShowPopoverGiamGia = Boolean(anchorGiamGiaHD);

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSavingHoaDon, setIsSavingHoaDon] = useState(false);
    const [customerHasGDV, setCustomerHasGDV] = useState(false);
    const [isThanhToanTienMat, setIsThanhToanTienMat] = useState(true);
    const [isShowModalSuDungGDV, setIsShowModalSuDungGDV] = useState(false);
    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    //const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [propNVThucHien, setPropNVThucHien] = useState<PropModal>(new PropModal({ isShow: false, isNew: true }));

    const [arrIdNhomHangChosed, setArrIdNhomHangChosed] = useState<string[]>([]);
    const [nhomHangHoaChosed, setNhomHangHoaChosed] = useState<ModelNhomHangHoa[]>([]);
    const [listProduct, setListProduct] = useState<IHangHoaGroupTheoNhomDto[]>([]);
    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [customerChosed, setCustomerChosed] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [idCTHDChosing, setIdCTHDChosing] = useState('');
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: null,
            idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: idChiNhanhChosed
        })
    );

    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1, // 1.remove customer, 2.change tabhoadon
        mes: ''
    });

    const GetListNhomHangHoa_byId = async (arrIdNhomHang: string[]) => {
        const list = await GroupProductService.GetListNhomHangHoa_byId(arrIdNhomHang);
        setNhomHangHoaChosed(list);
    };

    const BoChon1NhomHang = (idNhomHang: string) => {
        setArrIdNhomHangChosed(arrIdNhomHangChosed?.filter((x) => x !== idNhomHang));
        const arrIdNhom = arrIdNhomHangChosed?.filter((x) => x !== idNhomHang);
        GetListNhomHangHoa_byId(arrIdNhom ?? []);
        getListHangHoa_groupbyNhom(txtSearch, arrIdNhom ?? []);
    };
    const BoChonAllNhomHang = () => {
        setArrIdNhomHangChosed([]);
        GetListNhomHangHoa_byId([]);
        getListHangHoa_groupbyNhom(txtSearch, []);
    };

    const getListHangHoa_groupbyNhom = async (txtSearch: string, arrIdNhomHang: string[] = []) => {
        setIsLoadingData(true);
        const input = {
            IdNhomHangHoas: arrIdNhomHang,
            TextSearch: txtSearch,
            IdLoaiHangHoa: 0, // all
            CurrentPage: 0,
            PageSize: 50
        } as PagedProductSearchDto;
        const data = await ProductService.GetDMHangHoa_groupByNhom(input);
        setListProduct(data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        setArrIdNhomHangChosed(arrIdNhomHangFilter ?? []);

        if ((arrIdNhomHangFilter?.length ?? 0) > 0) {
            getListHangHoa_groupbyNhom(txtSearch, arrIdNhomHangFilter ?? []);
            GetListNhomHangHoa_byId(arrIdNhomHangFilter ?? []);
        }
    }, [arrIdNhomHangFilter]);

    const GetInforCustomer_byId = async (cusId: string) => {
        const customer = await khachHangService.getKhachHang(cusId);
        setCustomerChosed(customer);
    };

    const SetDataHoaDon_byIdWaiting = async () => {
        const hdCache = await dbDexie.hoaDon
            .where('id')
            .equals(idInvoiceWaiting ?? '')
            .toArray();
        if ((hdCache?.length ?? 0) > 0) {
            setHoaDon({
                ...hdCache[0]
            });
            setHoaDonChiTiet([...(hdCache[0]?.hoaDonChiTiet ?? [])]);

            await GetInforCustomer_byId(hdCache[0]?.idKhachHang ?? Guid.EMPTY);
            await CheckCustomer_hasGDV(hdCache[0]?.idKhachHang ?? Guid.EMPTY);

            onSetActiveTabLoaiHoaDon(hdCache[0]?.idLoaiChungTu ?? LoaiChungTu.HOA_DON_BAN_LE);
        } else {
            onSetActiveTabLoaiHoaDon(LoaiChungTu.HOA_DON_BAN_LE);

            setHoaDon({
                ...hoadon,
                idKhachHang: '',
                idChiNhanh: idChiNhanhChosed,
                idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE
            });
            setHoaDonChiTiet([]);
        }
    };

    const InitData_forHoaDon = async () => {
        console.log('into ');
        const idCheckInNew = idCheckIn ?? Guid.EMPTY;
        const hdCache = await dbDexie.hoaDon
            .where('idCheckIn')
            .equals(idCheckInNew)
            .and((x) => x.idChiNhanh === idChiNhanhChosed)
            .toArray();
        if (hdCache?.length > 0) {
            setHoaDon({
                ...hdCache[0]
            });
            setHoaDonChiTiet([...(hdCache[0]?.hoaDonChiTiet ?? [])]);
            onSetActiveTabLoaiHoaDon(hdCache[0]?.idLoaiChungTu ?? LoaiChungTu.HOA_DON_BAN_LE);
        } else {
            onSetActiveTabLoaiHoaDon(LoaiChungTu.HOA_DON_BAN_LE);

            setHoaDon({
                ...hoadon,
                idKhachHang: customerIdChosed,
                idChiNhanh: idChiNhanhChosed,
                idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
                idCheckIn: idCheckInNew
            });
        }
    };

    const AddHD_toCache_IfNotExists = async () => {
        // add to cache if not exists
        const hdExist = await dbDexie.hoaDon.where('id').equals(hoadon?.id).toArray();
        if (hdExist?.length == 0) {
            const dataHD: PageHoaDonDto = {
                ...hoadon,
                idKhachHang: hoadon?.idKhachHang ?? Guid.EMPTY,
                idChiNhanh: hoadon?.idChiNhanh ?? idChiNhanhChosed,
                idLoaiChungTu: hoadon.idLoaiChungTu,
                idCheckIn: hoadon?.idCheckIn ?? Guid.EMPTY
            };
            await dbDexie.hoaDon.add(dataHD);
            onAddHoaDon_toCache();
        }
    };

    const AgreeChangeLoaiHoaDon = async () => {
        setHoaDon({ ...hoadon, idLoaiChungTu: loaiHoaDon });

        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.idLoaiChungTu = loaiHoaDon));
    };

    const ChangeLoaiHoaDon = async () => {
        if (loaiHoaDon !== LoaiChungTu.HOA_DON_BAN_LE) {
            const check = CheckDangSuDungGDV(2);
            if (!check) {
                return;
            }
        }

        await AgreeChangeLoaiHoaDon();
    };

    useEffect(() => {
        // firstload: auto set loaiHoadon = HOA_DON_BAN_LE

        InitData_forHoaDon();
    }, [idChiNhanhChosed, idCheckIn, customerIdChosed]);

    useEffect(() => {
        // update loaiHoaDon if change tab
        if (firstLoad_changeLoaiHD.current) {
            firstLoad_changeLoaiHD.current = false;
            return;
        }
        ChangeLoaiHoaDon();
    }, [loaiHoaDon]);

    useEffect(() => {
        // get & set HD by IdInvoiceWaiting
        if (firstLoad_changeIdInvoiceWaiting.current) {
            firstLoad_changeIdInvoiceWaiting.current = false;
            return;
        }
        SetDataHoaDon_byIdWaiting();
    }, [idInvoiceWaiting]);

    useEffect(() => {
        GetInforCustomer_byId(customerIdChosed);
        CheckCustomer_hasGDV(customerIdChosed);
    }, [customerIdChosed]);

    const PageLoad = () => {
        //
    };

    const cthd_SumThanhTienTruocCK = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.thanhTienTruocCK ?? 0) + prevValue;
    }, 0);

    const cthd_SumTienChietKhau = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (
            //  sudung gdv: chietkhau = 0
            (utils.checkNull_OrEmpty(item?.idChiTietHoaDon) ? item?.tienChietKhau ?? 0 : 0) * item.soLuong + prevValue
        );
    }, 0);
    const cthd_SumTienThue = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienThue ?? 0) * item.soLuong + prevValue;
    }, 0);

    const openPopoverGiamGia = (event: React.MouseEvent<HTMLElement | SVGElement>) => {
        setAnchorGiamGiaHD(event.currentTarget);
    };

    const closePopoverGiamGia = () => {
        setAnchorGiamGiaHD(null);
    };

    const changeGiamGiaHoaDon = async (ptGiamGia: number, tongGiamGia: number) => {
        const tongPhaiTra = (hoadon?.tongTienHDSauVAT ?? 0) - tongGiamGia;
        setSumTienKhachTra(tongPhaiTra);

        setHoaDon({
            ...hoadon,
            pTGiamGiaHD: ptGiamGia,
            tongGiamGiaHD: tongGiamGia,
            tongThanhToan: tongPhaiTra
        });

        dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => {
                o.pTGiamGiaHD = ptGiamGia;
                o.tongGiamGiaHD = tongGiamGia;
                o.tongThanhToan = tongPhaiTra;
            });
    };

    const showModalSuDungGDV = async () => {
        setIsShowModalSuDungGDV(true);
    };

    const GDV_CheckSuDungQuaBuoi = (lstChosed: ChiTietSuDungGDVDto[]) => {
        let tenDV = '';
        for (let index = 0; index < lstChosed.length; index++) {
            const element = lstChosed[index];
            // check exist cthd
            const itemCTHD = hoaDonChiTiet?.filter(
                (x) => x.idDonViQuyDoi === element?.idDonViQuyDoi && x.idChiTietHoaDon === element?.idChiTietHoaDon
            );
            if (itemCTHD?.length > 0) {
                if (itemCTHD[0]?.soLuong + 1 > element?.soLuongConLai) {
                    tenDV += element?.tenHangHoa + ', ';
                }
            }
        }
        if (!utils.checkNull(tenDV)) {
            setObjAlert({
                ...objAlert,
                show: true,
                type: 2,
                mes: `Dịch vụ ${utils.Remove_LastComma(tenDV)} vượt quá số buổi còn lại`
            });
            return false;
        }
        return true;
    };
    const AgreeSuDungGDV = async (type: number, lstChosed?: ChiTietSuDungGDVDto[]) => {
        setIsShowModalSuDungGDV(false);
        if (lstChosed) {
            const checkSD = GDV_CheckSuDungQuaBuoi(lstChosed);
            if (!checkSD) {
                return;
            }

            if (hoadon?.idLoaiChungTu !== LoaiChungTu.HOA_DON_BAN_LE) {
                // update loaiHoaDon
                setHoaDon({ ...hoadon, idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE });
                await dbDexie.hoaDon.update(hoadon?.id, {
                    idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE
                });
                onSetActiveTabLoaiHoaDon(LoaiChungTu.HOA_DON_BAN_LE);
            }
            // if = GDV --> add newHD with customer
            // remove ctold if same & add again
            const cthdRemove: PageHoaDonChiTietDto[] = [];
            const arrChosed: PageHoaDonChiTietDto[] = [];
            for (let index = 0; index < lstChosed.length; index++) {
                const element = lstChosed[index];
                // check exist cthd
                const itemCTHD = hoaDonChiTiet?.filter(
                    (x) => x.idDonViQuyDoi === element?.idDonViQuyDoi && x?.idChiTietHoaDon === element?.idChiTietHoaDon
                );
                if (itemCTHD?.length > 0) {
                    // tang soluong
                    const newCT = { ...itemCTHD[0] };
                    newCT.soLuong = newCT.soLuong + 1;
                    arrChosed.push(newCT);

                    cthdRemove.push(itemCTHD[0]);
                } else {
                    // add new
                    const newCT = new PageHoaDonChiTietDto({
                        id: Guid.create().toString(),
                        soLuong: 1,
                        maHangHoa: element?.maHangHoa,
                        tenHangHoa: element?.tenHangHoa,
                        idDonViQuyDoi: element?.idDonViQuyDoi,
                        idHangHoa: element?.idHangHoa,
                        idNhomHangHoa: element?.idNhomHangHoa
                    });
                    newCT.idChiTietHoaDon = element?.idChiTietHoaDon;
                    newCT.soLuongConLai = element?.soLuongConLai ?? 0;
                    newCT.donGiaTruocCK = element?.donGiaTruocCK ?? 0;
                    newCT.tienChietKhau = element?.tienChietKhau ?? 0;
                    // sử dụng gdv: thành tiền = 0
                    newCT.thanhTienTruocCK = 0;
                    newCT.thanhTienSauCK = 0;
                    newCT.thanhTienSauVAT = 0;
                    arrChosed.push(newCT);
                }
            }
            const arrIdCTHDRemove = cthdRemove?.map((x) => {
                return x.id;
            });
            const arrCT_afterRemove = hoaDonChiTiet?.filter((x) => !arrIdCTHDRemove.includes(x.id));
            const lstCTHDLast = [...arrChosed, ...(arrCT_afterRemove ?? [])];
            setHoaDonChiTiet([...lstCTHDLast]);

            await UpdateCTHD_toCache([...lstCTHDLast]);
        }
    };

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        // change cthd --> update hoadon
        const sumThanhTienSauCK = cthd_SumThanhTienTruocCK - cthd_SumTienChietKhau;
        const sumThanhTienSauVAT = sumThanhTienSauCK - cthd_SumTienThue;
        const ptGiamGiaHD = sumThanhTienSauCK > 0 ? hoadon?.pTGiamGiaHD ?? 0 : 0;
        let tongGiamHD = sumThanhTienSauCK > 0 ? hoadon?.tongGiamGiaHD ?? 0 : 0;

        if (ptGiamGiaHD > 0) {
            tongGiamHD = (ptGiamGiaHD * sumThanhTienSauVAT) / 100;
        }
        const tongPhaiTra = sumThanhTienSauVAT - tongGiamHD;

        setSumTienKhachTra(tongPhaiTra);
        //setTienThuaTraKhach(0);
        setHoaDon({
            ...hoadon,
            pTGiamGiaHD: ptGiamGiaHD,
            tongGiamGiaHD: tongGiamHD,
            tongTienHangChuaChietKhau: cthd_SumThanhTienTruocCK,
            tongChietKhauHangHoa: cthd_SumTienChietKhau,
            tongTienHang: sumThanhTienSauCK,
            tongTienHDSauVAT: sumThanhTienSauVAT,
            tongThanhToan: tongPhaiTra
        });
        dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => {
                o.pTGiamGiaHD = ptGiamGiaHD;
                o.tongGiamGiaHD = tongGiamHD;
                o.tongTienHangChuaChietKhau = cthd_SumThanhTienTruocCK;
                o.tongChietKhauHangHoa = cthd_SumTienChietKhau;
                o.tongTienHang = sumThanhTienSauCK;
                o.tongTienHDSauVAT = sumThanhTienSauVAT;
                o.tongThanhToan = tongPhaiTra;
            });
    }, [cthd_SumThanhTienTruocCK, cthd_SumTienChietKhau, cthd_SumTienThue]);

    useEffect(() => {
        PageLoad();
    }, []);

    // only used when change textsearch
    const debounceSearchHangHoa = useRef(
        debounce(async (txtSearch: string) => {
            getListHangHoa_groupbyNhom(txtSearch, arrIdNhomHangChosed);
        }, 500)
    ).current;

    useEffect(() => {
        debounceSearchHangHoa(txtSearch);
    }, [txtSearch]);

    const removeCTHD = async (item: HoaDonChiTietDto) => {
        setHoaDonChiTiet(hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi));
        const cthd = hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi);
        await UpdateCTHD_toCache([...cthd]);
    };

    const choseProduct = async (item: ModelHangHoaDto) => {
        await AddHD_toCache_IfNotExists();

        let cthdLast: PageHoaDonChiTietDto[] = [];
        const newCT = new PageHoaDonChiTietDto({
            idDonViQuyDoi: item?.idDonViQuyDoi as unknown as undefined,
            maHangHoa: item?.maHangHoa,
            tenHangHoa: item?.tenHangHoa,
            giaBan: item?.giaBan as undefined,
            idNhomHangHoa: item?.idNhomHangHoa as undefined,
            idHangHoa: item?.id as undefined,
            soLuong: 1,
            expanded: false
        });
        const itemCTHD = hoaDonChiTiet?.filter(
            (x) => x.idDonViQuyDoi === item.idDonViQuyDoi && utils.checkNull_OrEmpty(x.idChiTietHoaDon)
        );
        if (itemCTHD?.length > 0) {
            const slNew = itemCTHD[0].soLuong + 1;
            newCT.id = itemCTHD[0].id;
            newCT.soLuong = slNew;
            newCT.giaBan = itemCTHD[0]?.giaBan ?? 0;
            newCT.ptChietKhau = itemCTHD[0]?.ptChietKhau ?? 0;
            newCT.ptThue = itemCTHD[0]?.ptThue ?? 0;
            if (newCT.ptChietKhau > 0) {
                newCT.tienChietKhau = (newCT.ptChietKhau * newCT.giaBan) / 100;
            } else {
                newCT.tienChietKhau = itemCTHD[0]?.tienChietKhau ?? 0;
            }
            if (newCT.ptThue > 0) {
                newCT.tienThue = (newCT.ptThue * (newCT?.donGiaSauCK ?? 0)) / 100;
            } else {
                newCT.tienThue = itemCTHD[0]?.tienChietKhau ?? 0;
            }

            newCT.nhanVienThucHien = newCT.nhanVienThucHien?.map((nv) => {
                if (nv.ptChietKhau > 0) {
                    return {
                        ...nv,
                        tienChietKhau: (nv.ptChietKhau * (newCT?.thanhTienSauCK ?? 0)) / 100
                    };
                } else {
                    return {
                        ...nv,
                        // tienCK/soluongOld * slNew
                        tienChietKhau: (nv.tienChietKhau / itemCTHD[0].soLuong) * newCT.soLuong
                    };
                }
            });

            // remove & add again
            const arrConLai = hoaDonChiTiet?.filter(
                (x) =>
                    (x.idDonViQuyDoi === item.idDonViQuyDoi && !utils.checkNull_OrEmpty(x.idChiTietHoaDon)) ||
                    x.idDonViQuyDoi !== item.idDonViQuyDoi
            );
            setHoaDonChiTiet([newCT, ...arrConLai]);

            cthdLast = [newCT, ...arrConLai];
        } else {
            setHoaDonChiTiet([newCT, ...hoaDonChiTiet]);
            cthdLast = [newCT, ...hoaDonChiTiet];
        }

        await UpdateCTHD_toCache(cthdLast);
    };

    const UpdateCTHD_toCache = async (cthdNew: PageHoaDonChiTietDto[]) => {
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.hoaDonChiTiet = cthdNew));
    };

    const changeCustomer_fromModalAdd = async (customer?: KhachHangDto) => {
        setIsShowModalAddCus(false);
        if (customer) {
            setCustomerChosed({
                ...customerChosed,
                id: customer?.id?.toString(),
                maKhachHang: customer?.maKhachHang,
                tenKhachHang: customer?.tenKhachHang ?? 'Khách lẻ',
                soDienThoai: customer?.soDienThoai ?? ''
            });

            const idCheckin = await InsertCustomer_toCheckIn(customer?.id?.toString());
            setHoaDon({ ...hoadon, idKhachHang: customer?.id?.toString(), idCheckIn: idCheckin });

            await AddHD_toCache_IfNotExists();
            await dbDexie.hoaDon.update(hoadon?.id, {
                idCheckIn: idCheckin,
                idKhachHang: customer?.id?.toString(),
                tenKhachHang: customer?.tenKhachHang,
                maKhachHang: customer?.maKhachHang,
                soDienThoai: customer?.soDienThoai
            });
            setCustomerHasGDV(false);
        }
    };

    const InsertCustomer_toCheckIn = async (customerId: string): Promise<string> => {
        const objCheckInNew: KHCheckInDto = {
            id: Guid.EMPTY,
            idKhachHang: customerId,
            dateTimeCheckIn: hoadon?.ngayLapHoaDon,
            idChiNhanh: idChiNhanhChosed,
            trangThai: TrangThaiCheckin.DOING,
            ghiChu: ''
        };
        const dataCheckIn = await CheckinService.InsertCustomerCheckIn(objCheckInNew);
        return dataCheckIn.id;
    };

    const changeCustomer = async (item: IList) => {
        setAnchorDropdownCustomer(null);
        setCustomerChosed({
            ...customerChosed,
            id: item?.id,
            maKhachHang: item?.text, // todo makhachhang
            tenKhachHang: item?.text ?? 'Khách lẻ',
            soDienThoai: item?.text2 ?? ''
        });

        const idCheckin = await InsertCustomer_toCheckIn(item?.id ?? Guid.EMPTY);
        setHoaDon({ ...hoadon, idKhachHang: item?.id, idCheckIn: idCheckin });

        await AddHD_toCache_IfNotExists();
        await dbDexie.hoaDon.update(hoadon?.id, {
            idCheckIn: idCheckin,
            idKhachHang: item?.id,
            tenKhachHang: item?.text,
            maKhachHang: item?.text, // todo maKhachHang
            soDienThoai: item?.text2
        });

        await CheckCustomer_hasGDV(item?.id ?? '');
    };

    const CheckCustomer_hasGDV = async (customerId: string) => {
        const existGDV = await HoaDonService.CheckCustomer_hasGDV(customerId);
        setCustomerHasGDV(existGDV);
    };

    const ResetCTHD_ifUsingGDV = async () => {
        // reset cthd (if using GDV)
        setHoaDonChiTiet(
            hoaDonChiTiet?.map((x) => {
                return {
                    ...x,
                    idChiTietHoaDon: null,
                    soLuongConLai: 0,
                    thanhTienTruocCK: x.soLuong * (x?.donGiaTruocCK ?? 0),
                    thanhTienSauCK: x.soLuong * (x?.donGiaSauCK ?? 0),
                    thanhTienSauVAT: x.soLuong * (x?.donGiaSauVAT ?? 0)
                };
            })
        );

        const arrCT = hoaDonChiTiet?.map((x) => {
            return {
                ...x,
                idChiTietHoaDon: null,
                soLuongConLai: 0,
                thanhTienTruocCK: x.soLuong * (x?.donGiaTruocCK ?? 0),
                thanhTienSauCK: x.soLuong * (x?.donGiaSauCK ?? 0),
                thanhTienSauVAT: x.soLuong * (x?.donGiaSauVAT ?? 0)
            };
        });

        await UpdateCTHD_toCache([...arrCT]);
    };

    const AgreeRemoveCustomer = async () => {
        const idCheckinDelete = hoadon?.idCheckIn ?? Guid.EMPTY;
        await CheckinService.UpdateTrangThaiCheckin(idCheckinDelete, TrangThaiCheckin.DELETED);
        await CheckinService.UpdateTrangThaiBooking_byIdCheckIn(idCheckinDelete, TrangThaiBooking.Confirm);
        setCustomerHasGDV(false);
        setConfirmDialog({ ...confirmDialog, show: false });
        setHoaDon({ ...hoadon, idKhachHang: null });
        setCustomerChosed({
            ...customerChosed,
            id: Guid.EMPTY,
            maKhachHang: 'KL', // todo makhachhang
            tenKhachHang: 'Khách lẻ',
            soDienThoai: ''
        });
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.idKhachHang = null));
    };

    const CheckDangSuDungGDV = (type: number) => {
        const ctSuDung = hoaDonChiTiet?.filter((x) => !utils.checkNull_OrEmpty(x.idChiTietHoaDon));
        if (ctSuDung?.length > 0) {
            setConfirmDialog({
                ...confirmDialog,
                show: true,
                type: type,
                mes: 'Đang sử dụng Gói dịch vụ. Bạn có muốn chuyển sang mua mới không?',
                title: 'Xác nhận chuyển đổi'
            });
            return false;
        }
        return true;
    };

    const RemoveCustomer = async () => {
        const check = CheckDangSuDungGDV(1);
        if (!check) {
            return;
        }
        await AgreeRemoveCustomer();
    };

    const showModalAddCustomer = () => {
        setIsShowModalAddCus(true);
        setNewCus({
            ...newCus,
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
        });
    };

    const changeNgayLapHoaDon = async (dt: string) => {
        setHoaDon({
            ...hoadon,
            ngayLapHoaDon: dt
        });
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.ngayLapHoaDon = dt));
    };

    const onClickOKConfirm = async () => {
        switch (confirmDialog.type) {
            case 1:
                {
                    await AgreeRemoveCustomer();
                }
                break;
            case 2:
                {
                    await AgreeChangeLoaiHoaDon();
                }
                break;
        }
        await ResetCTHD_ifUsingGDV();
    };

    const showPopNhanVienThucHien = (item: HoaDonChiTietDto) => {
        setPropNVThucHien((old) => {
            return { ...old, isShow: true, isNew: true, item: item, id: item.id };
        });
    };

    const AgreeNVThucHien = async (lstNVChosed: NhanVienThucHienDto[]) => {
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

        const arrCT = hoaDonChiTiet.map((x) => {
            if (propNVThucHien.item.id === x.id) {
                return { ...x, nhanVienThucHien: lstNVChosed };
            } else {
                return x;
            }
        });
        await UpdateCTHD_toCache(arrCT);
    };

    const RemoveNVThucHien = async (cthd: PageHoaDonChiTietDto, nv: NhanVienThucHienDto) => {
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
        const arrCT = hoaDonChiTiet.map((x) => {
            if (x.id === cthd.id) {
                return {
                    ...x,
                    nhanVienThucHien: x.nhanVienThucHien?.filter((nvth) => nvth.idNhanVien !== nv.idNhanVien)
                };
            } else {
                return x;
            }
        });
        await UpdateCTHD_toCache(arrCT);
    };

    // modal chitiet giohang
    const showPopChiTietGioHang = (idChiTiet: string) => {
        setIsShowEditGioHang(true);
        setIdCTHDChosing(idChiTiet);
    };

    const AgreeGioHang = async (lstCTAfter: PageHoaDonChiTietDto[]) => {
        setIsShowEditGioHang(false);

        if (lstCTAfter?.length > 0) {
            const ctUpdate = lstCTAfter[0];
            // update cthd + save to cache
            setHoaDonChiTiet(
                hoaDonChiTiet.map((item) => {
                    if (item.id === ctUpdate.id) {
                        const isSuDungDV = !utils.checkNull_OrEmpty(item?.idChiTietHoaDon ?? '');
                        return {
                            ...item,
                            soLuong: ctUpdate.soLuong,
                            donGiaTruocCK: ctUpdate.donGiaTruocCK,
                            laPTChietKhau: ctUpdate.laPTChietKhau,
                            ptChietKhau: ctUpdate.ptChietKhau,
                            tienChietKhau: ctUpdate.tienChietKhau,
                            donGiaSauCK: ctUpdate.donGiaSauCK,
                            donGiaSauVAT: ctUpdate.donGiaSauVAT,
                            thanhTienTruocCK: isSuDungDV ? 0 : ctUpdate.thanhTienTruocCK,
                            thanhTienSauCK: isSuDungDV ? 0 : ctUpdate.thanhTienSauCK,
                            thanhTienSauVAT: isSuDungDV ? 0 : ctUpdate.thanhTienSauVAT,
                            nhanVienThucHien: item?.nhanVienThucHien?.map((nv) => {
                                if (nv.ptChietKhau > 0) {
                                    return {
                                        ...nv,
                                        // soluong * dongia (tránh trường hợp sử dụng GDV: thanhtien = 0)
                                        tienChietKhau:
                                            (nv.ptChietKhau * ctUpdate.soLuong * (ctUpdate?.donGiaSauCK ?? 0)) / 100
                                    };
                                } else {
                                    return {
                                        ...nv,
                                        // (tienchietkhau/soLuongCu) * slNew
                                        tienChietKhau: (nv.tienChietKhau / item.soLuong) * ctUpdate.soLuong
                                    };
                                }
                            })
                        };
                    } else {
                        return item;
                    }
                })
            );

            const arrCT = hoaDonChiTiet.map((item) => {
                if (item.id === ctUpdate.id) {
                    const isSuDungDV = !utils.checkNull_OrEmpty(item?.idChiTietHoaDon ?? '');
                    return {
                        ...item,
                        soLuong: ctUpdate.soLuong,
                        donGiaTruocCK: ctUpdate.donGiaTruocCK,
                        laPTChietKhau: ctUpdate.laPTChietKhau,
                        ptChietKhau: ctUpdate.ptChietKhau,
                        tienChietKhau: ctUpdate.tienChietKhau,
                        donGiaSauCK: ctUpdate.donGiaSauCK,
                        donGiaSauVAT: ctUpdate.donGiaSauVAT,
                        thanhTienTruocCK: isSuDungDV ? 0 : ctUpdate.thanhTienTruocCK,
                        thanhTienSauCK: isSuDungDV ? 0 : ctUpdate.thanhTienSauCK,
                        thanhTienSauVAT: isSuDungDV ? 0 : ctUpdate.thanhTienSauVAT,
                        nhanVienThucHien: item?.nhanVienThucHien?.map((nv) => {
                            if (nv.ptChietKhau > 0) {
                                return {
                                    ...nv,
                                    tienChietKhau:
                                        (nv.ptChietKhau * ctUpdate.soLuong * (ctUpdate?.donGiaSauCK ?? 0)) / 100
                                };
                            } else {
                                return {
                                    ...nv,
                                    tienChietKhau: (nv.tienChietKhau / item.soLuong) * ctUpdate.soLuong
                                };
                            }
                        })
                    };
                } else {
                    return item;
                }
            });

            await UpdateCTHD_toCache(arrCT);
        }
    };

    // end modal chi tiet

    const checkSaveInvoice = async () => {
        if (hoaDonChiTiet.length === 0) {
            setObjAlert({
                show: true,
                type: 2,
                mes: 'Vui lòng nhập chi tiết hóa đơn '
            });
            return false;
        }
        if (utils.checkNull_OrEmpty(hoadon?.idKhachHang)) {
            if (sumTienKhachTra < hoadon?.tongThanhToan) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Là khách lẻ. Không cho phép nợ'
                });
                return false;
            }
        }
        if (hoadon?.idLoaiChungTu === LoaiChungTu.GOI_DICH_VU) {
            if (utils.checkNull_OrEmpty(hoadon?.idKhachHang)) {
                setObjAlert({
                    show: true,
                    type: 2,
                    mes: 'Vui lòng chọn khách hàng khi mua gói dịch vụ'
                });
                return false;
            }
        }

        return true;
    };

    const ResetState_AfterSave = async () => {
        setIsSavingHoaDon(false);
        setIsThanhToanTienMat(true);
        setCustomerHasGDV(false);

        setHoaDonChiTiet([]);
        const newHD = new PageHoaDonDto({
            id: Guid.create().toString(),
            idLoaiChungTu: hoadon.idLoaiChungTu,
            idKhachHang: customerIdChosed as unknown as undefined,
            idChiNhanh: idChiNhanhChosed,
            tenKhachHang: 'Khách lẻ'
        });
        setHoaDon({ ...newHD });
        setCustomerChosed({
            ...customerChosed,
            id: '',
            maKhachHang: 'KL',
            tenKhachHang: 'Khách lẻ',
            soDienThoai: '',
            tongTichDiem: 0,
            avatar: ''
        } as CreateOrEditKhachHangDto);

        onSetActiveTabLoaiHoaDon(hoadon.idLoaiChungTu);
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
        if (utils.checkNull(customerChosed?.soDienThoai)) {
            txtKhachHang = `${customerChosed?.tenKhachHang}`;
        } else {
            txtKhachHang = ` ${customerChosed?.tenKhachHang} (${customerChosed?.soDienThoai})`;
        }

        const diary = {
            idChiNhanh: idChiNhanhChosed,
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

    const thanhToanAtPaymentForm = async (
        tienTheGiaTri: number,
        tienMat: number,
        tienCK: number,
        tienPOS: number,
        idTaiKhoanCK: string | null,
        idTaiKHoanPos: string | null,
        noiDungThu: string
    ) => {
        const hoadonDB = await saveHoaDon();
        if (hoadonDB) {
            const dataQuyHD = await SoQuyServices.savePhieuThu_forHoaDon({
                idChiNhanh: idChiNhanhChosed,
                phaiTT: hoadon?.tongThanhToan ?? 0,
                thegiatri: tienTheGiaTri,
                tienmat: tienMat,
                tienCK: tienCK,
                tienPOS: tienPOS,
                idTaiKhoanChuyenKhoan: idTaiKhoanCK as null,
                idTaiKhoanPOS: idTaiKHoanPos as null,
                ngayLapHoaDon: hoadonDB?.ngayLapHoaDon,
                noiDungThu: noiDungThu,
                hoadon: {
                    maHoaDon: hoadonDB?.maHoaDon,
                    id: (hoadonDB?.id ?? null) as unknown as null,
                    idKhachHang: customerChosed?.id as unknown as null,
                    tenKhachHang: customerChosed?.tenKhachHang
                }
            });
            if (dataQuyHD != null) {
                // used to print content in QRCode
                dataQuyHD?.quyHoaDon_ChiTiet?.map((x: QuyChiTietDto) => {
                    x.maHoaDonLienQuan = hoadonDB?.maHoaDon;
                });
                await InHoaDon(hoadonDB?.maHoaDon, hoadonDB?.ngayLapHoaDon, dataQuyHD);
            }
        }
    };

    const saveHoaDon = async () => {
        setIsSavingHoaDon(true);
        if (isSavingHoaDon) return;

        const checkSave = await checkSaveInvoice();
        if (!checkSave) {
            setIsSavingHoaDon(false);
            return;
        }

        const dataSave = { ...hoadon };
        dataSave.hoaDonChiTiet = hoaDonChiTiet;
        dataSave?.hoaDonChiTiet?.map((x: PageHoaDonChiTietDto, index: number) => {
            x.stt = index + 1; // update STT for cthd
        });
        const hoadonDB = await HoaDonService.CreateHoaDon(dataSave);
        if (hoadonDB != null) {
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Thanh toán hóa đơn thành công'
            });

            await saveDiaryHoaDon(hoadonDB?.maHoaDon, hoadonDB?.ngayLapHoaDon);

            await CheckinService.UpdateTrangThaiCheckin(hoadon?.idCheckIn, TrangThaiCheckin.COMPLETED);
            await CheckinService.Update_IdHoaDon_toCheckInHoaDon(hoadon?.idCheckIn, hoadonDB.id);

            if (isThanhToanTienMat) {
                const dataQuyHD = await SoQuyServices.savePhieuThu_forHoaDon({
                    idChiNhanh: idChiNhanhChosed,
                    phaiTT: hoadon?.tongThanhToan ?? 0,
                    tienmat: sumTienKhachTra,
                    ngayLapHoaDon: hoadon?.ngayLapHoaDon,
                    hoadon: {
                        maHoaDon: hoadonDB?.maHoaDon,
                        id: (hoadonDB?.id ?? null) as unknown as null,
                        idKhachHang: customerChosed?.id as unknown as null,
                        tenKhachHang: customerChosed?.tenKhachHang
                    }
                });
                if (dataQuyHD != null) {
                    await InHoaDon(hoadonDB?.maHoaDon, hoadonDB?.ngayLapHoaDon, dataQuyHD);
                }
            }

            await dbDexie.hoaDon.where('id').equals(hoadon?.id).delete();
            ResetState_AfterSave();
            onRemoveHoaDon_toCache();
            return hoadonDB;
        }
    };

    const getInforChiNhanh_byID = async (idChiNhanh: string) => {
        const data = await chiNhanhService.GetDetail(idChiNhanh ?? '');
        return data;
    };

    const InHoaDon = async (mahoadon = '', ngayLapHD = '', quyHD: QuyHoaDonDto) => {
        const chinhanhPrint = await getInforChiNhanh_byID(idChiNhanhChosed ?? '');
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
        DataMauIn.hoadon.conNo = hoadon?.tongThanhToan ?? 0 - quyHD?.tongTienThu ?? 0;
        DataMauIn.hoadonChiTiet = hoaDonChiTiet;
        DataMauIn.khachhang = {
            maKhachHang: customerChosed?.maKhachHang,
            tenKhachHang: customerChosed?.tenKhachHang,
            soDienThoai: customerChosed?.soDienThoai
        } as KhachHangItemDto;
        DataMauIn.phieuthu = quyHD;

        let newHtml = DataMauIn.replaceChiTietHoaDon(tempMauIn);
        newHtml = DataMauIn.replaceChiNhanh(newHtml);
        newHtml = DataMauIn.replaceHoaDon(newHtml);
        newHtml = await DataMauIn.replacePhieuThuChi(newHtml);
        DataMauIn.Print(newHtml);
    };

    // if (isLoadingData) {
    //     return <Loading />;
    // }

    return (
        <>
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onClickOKConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <CreateOrEditCustomerDialog
                visible={isShowModalAddCus}
                onCancel={() => setIsShowModalAddCus(false)}
                onOk={changeCustomer_fromModalAdd}
                title="Thêm mới khách hàng"
                formRef={newCus}
            />
            <ModalSuDungGDV
                isShowModal={isShowModalSuDungGDV}
                idUpdate={customerChosed?.id}
                onClose={() => setIsShowModalSuDungGDV(false)}
                onOK={AgreeSuDungGDV}
            />
            <ModalEditChiTietGioHang
                formType={1}
                isShow={isShowEditGioHang}
                hoadonChiTiet={hoaDonChiTiet.filter((x) => x.id === idCTHDChosing)}
                handleSave={AgreeGioHang}
                handleClose={() => setIsShowEditGioHang(false)}
            />
            <HoaHongNhanVienDichVu
                isNew={true}
                idChiNhanh={idChiNhanhChosed}
                iShow={propNVThucHien.isShow}
                itemHoaDonChiTiet={propNVThucHien.item}
                onSaveOK={AgreeNVThucHien}
                onClose={() => setPropNVThucHien({ ...propNVThucHien, isShow: false })}
            />
            <PopoverGiamGiaHD
                tongTienHang={hoadon?.tongTienHang}
                ptGiamGia={hoadon?.pTGiamGiaHD ?? 0}
                tongGiamGia={hoadon?.tongGiamGiaHD ?? 0}
                open={isShowPopoverGiamGia}
                anchorEl={anchorGiamGiaHD}
                onClosePopover={closePopoverGiamGia}
                onUpdateGiamGia={changeGiamGiaHoaDon}
            />
            <Grid container minHeight={'86vh'} maxHeight={'86vh'}>
                {!isThanhToanTienMat ? (
                    <Grid item lg={7} md={6} xs={12} zIndex={5}>
                        <PaymentsForm
                            tongPhaiTra={hoadon?.tongThanhToan ?? 0}
                            onClose={() => setIsThanhToanTienMat(true)}
                            onSaveHoaDon={thanhToanAtPaymentForm}
                            inforHD={{
                                maHoaDon: '',
                                idKhachHang: hoadon?.idKhachHang ?? '',
                                id: hoadon?.id ?? '',
                                idChiNhanh: hoadon?.idChiNhanh ?? '',
                                tenKhachHang: customerChosed?.tenKhachHang ?? ''
                            }}
                        />
                    </Grid>
                ) : (
                    <Grid
                        item
                        lg={7}
                        md={6}
                        xs={12}
                        sm={5}
                        borderRight={'1px solid rgb(224, 228, 235)'}
                        marginTop={{ md: '-64px', sm: '-64px', lg: 0 }}>
                        <Stack spacing={2} overflow={'auto'} maxHeight={'84vh'}>
                            {(nhomHangHoaChosed?.length ?? 0) > 0 && (
                                <Stack spacing={2}>
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        <Typography fontWeight={500}>Nhóm hàng đã chọn</Typography>
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            alignItems={'center'}
                                            color={'brown'}
                                            sx={{ cursor: 'pointer' }}>
                                            <Typography fontSize={13} onClick={() => BoChonAllNhomHang()}>
                                                Bỏ chọn tất cả
                                            </Typography>
                                            <CloseOutlinedIcon sx={{ width: 15, height: 15 }} />
                                        </Stack>
                                    </Stack>
                                    <Stack direction={'row'} spacing={1} sx={{ overflowX: 'auto' }}>
                                        {nhomHangHoaChosed?.map((x, index) => (
                                            <Stack key={index} padding={1} bgcolor={'#f0e0da'} borderRadius={4}>
                                                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                    <Typography
                                                        fontWeight={500}
                                                        className="lableOverflow"
                                                        maxWidth={300}
                                                        title={x?.tenNhomHang ?? ''}>
                                                        {x?.tenNhomHang}
                                                    </Typography>
                                                    <CloseOutlinedIcon
                                                        sx={{ width: 20, height: 20, cursor: 'pointer' }}
                                                        onClick={() => BoChon1NhomHang(x?.id ?? '')}
                                                    />
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}
                            {isLoadingData ? (
                                <Loading />
                            ) : (
                                <>
                                    {listProduct.map((nhom: IHangHoaGroupTheoNhomDto, index: number) => (
                                        <Stack key={index}>
                                            <Typography fontSize={16} fontWeight={500} marginBottom={0.5}>
                                                {nhom?.tenNhomHang}
                                            </Typography>
                                            <Grid container spacing={2} paddingRight={2}>
                                                {nhom?.hangHoas.map((item, index2) => (
                                                    <Grid key={index2} item lg={4} md={6} xs={12} sm={12}>
                                                        <Stack
                                                            padding={2}
                                                            title={item.tenHangHoa}
                                                            sx={{
                                                                backgroundColor: 'var(--color-bg)',
                                                                border: '1px solid transparent',
                                                                '&:hover': {
                                                                    borderColor: 'var(--color-main)',
                                                                    cursor: 'pointer'
                                                                }
                                                            }}>
                                                            <Stack spacing={2} onClick={() => choseProduct(item)}>
                                                                <Typography
                                                                    fontWeight={500}
                                                                    variant="body2"
                                                                    sx={{
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        width: '100%'
                                                                    }}>
                                                                    {item?.tenHangHoa}
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    {Intl.NumberFormat('vi-VN').format(
                                                                        item?.giaBan as number
                                                                    )}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Stack>
                                    ))}
                                </>
                            )}
                        </Stack>
                    </Grid>
                )}

                <Grid item lg={5} md={6} xs={12} sm={7}>
                    <Stack marginLeft={2} position={'relative'} height={'100%'}>
                        <Stack>
                            <Stack
                                direction={'row'}
                                paddingBottom={2}
                                maxHeight={57}
                                borderBottom={'1px solid #cccc'}
                                justifyContent={'space-between'}>
                                <Stack>
                                    <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                        <Avatar />
                                        <Stack
                                            spacing={1}
                                            onClick={(event) => {
                                                setAnchorDropdownCustomer(event.currentTarget);
                                            }}>
                                            <Stack
                                                direction={'row'}
                                                alignItems={'center'}
                                                spacing={1}
                                                title="Thay đổi khách hàng"
                                                sx={{ cursor: 'pointer' }}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={500}
                                                    className="lableOverflow"
                                                    maxWidth={350}>
                                                    {customerChosed?.tenKhachHang}
                                                </Typography>
                                                {!utils.checkNull_OrEmpty(customerChosed?.id ?? '') ? (
                                                    <CloseOutlinedIcon
                                                        color="error"
                                                        titleAccess="Bỏ chọn khách hàng"
                                                        sx={{ width: 20, cursor: 'pointer' }}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            RemoveCustomer();
                                                        }}
                                                    />
                                                ) : (
                                                    <IconButton
                                                        aria-label="add-customer"
                                                        color="primary"
                                                        title="Thêm khách hàng mới"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            showModalAddCustomer();
                                                        }}>
                                                        <AddOutlinedIcon color="info" sx={{ width: 20 }} />
                                                    </IconButton>
                                                )}
                                            </Stack>

                                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                                <Typography color={'#ccc'} variant="caption">
                                                    {customerChosed?.soDienThoai}
                                                </Typography>
                                                {customerHasGDV && (
                                                    <AutoStoriesOutlinedIcon
                                                        color="secondary"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            showModalSuDungGDV();
                                                        }}
                                                    />
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <MenuWithDataFromDB
                                        typeSearch={TypeSearchfromDB.CUSTOMER}
                                        open={expandSearchCus}
                                        anchorEl={anchorDropdownCustomer}
                                        handleClose={() => setAnchorDropdownCustomer(null)}
                                        handleChoseItem={changeCustomer}
                                    />
                                </Stack>

                                <Stack
                                    alignItems={'end'}
                                    sx={{
                                        '& fieldset': {
                                            border: 'none'
                                        },
                                        ' & input': {
                                            textAlign: 'right'
                                        }
                                    }}>
                                    <DatePickerCustom
                                        defaultVal={hoadon?.ngayLapHoaDon}
                                        handleChangeDate={changeNgayLapHoaDon}
                                    />
                                </Stack>
                            </Stack>

                            <Stack overflow={'auto'} maxHeight={'calc(84vh - 280px)!important'} zIndex={3}>
                                {hoaDonChiTiet
                                    ?.sort((x, y) => {
                                        // sap xep STT giamdan
                                        const a = x.stt;
                                        const b = y.stt;
                                        return a > b ? -1 : a < b ? 1 : 0;
                                    })
                                    .map((cthd, index) => (
                                        <Grid
                                            container
                                            key={index}
                                            borderBottom={'1px solid #cccc'}
                                            alignItems={'center'}
                                            padding={'8px 0px'}>
                                            <Grid item xs={12} lg={6} md={5}>
                                                <Stack spacing={1}>
                                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                        <PersonAddOutlinedIcon
                                                            titleAccess="Chọn nhân viên thực hiện"
                                                            sx={{ cursor: 'pointer' }}
                                                            onClick={() => showPopNhanVienThucHien(cthd)}
                                                        />
                                                        <Typography className="lableOverflow" title={cthd?.tenHangHoa}>
                                                            {cthd?.tenHangHoa}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} lg={6} md={7}>
                                                <Grid container alignItems={'center'}>
                                                    <Grid item xs={6}>
                                                        <Stack
                                                            spacing={1}
                                                            direction={'row'}
                                                            justifyContent={'end'}
                                                            title="Cập nhật giỏ hàng"
                                                            onClick={() => showPopChiTietGioHang(cthd?.id ?? '')}>
                                                            <Stack
                                                                direction={'row'}
                                                                spacing={1}
                                                                flex={1}
                                                                justifyContent={'end'}
                                                                alignItems={'center'}>
                                                                <Typography fontWeight={500} className="text-cursor">
                                                                    {cthd?.soLuong}
                                                                </Typography>

                                                                <Typography>x</Typography>
                                                            </Stack>
                                                            <Stack flex={3}>
                                                                <Typography className="text-cursor" textAlign={'left'}>
                                                                    {Intl.NumberFormat('vi-VN').format(
                                                                        cthd?.donGiaTruocCK ?? 0
                                                                    )}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Stack
                                                            spacing={0.5}
                                                            direction={'row'}
                                                            textAlign={'right'}
                                                            justifyContent={'end'}
                                                            alignItems={'center'}>
                                                            <Typography fontWeight={500}>
                                                                {Intl.NumberFormat('vi-VN').format(
                                                                    cthd?.thanhTienSauCK ?? 0
                                                                )}
                                                            </Typography>
                                                            <IconButton
                                                                aria-label="Xóa chi tiết hóa đơn"
                                                                title="Xóa chi tiết hóa đơn"
                                                                onClick={() => removeCTHD(cthd)}>
                                                                <DeleteOutlinedIcon color="error" />
                                                            </IconButton>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12} lg={6} md={5}>
                                                {(cthd?.nhanVienThucHien?.length ?? 0) > 0 && (
                                                    <Stack direction={'row'} spacing={1}>
                                                        {cthd?.nhanVienThucHien
                                                            ?.filter((x, index) => index < 2)
                                                            ?.map((nv, indexNV) => (
                                                                <Chip
                                                                    key={indexNV}
                                                                    sx={{
                                                                        backgroundColor: 'var(--color-bg)',
                                                                        '& .MuiChip-deleteIcon:hover': {
                                                                            color: 'red'
                                                                        }
                                                                    }}
                                                                    label={nv?.tenNhanVien}
                                                                    deleteIcon={<CloseIcon sx={{ width: 20 }} />}
                                                                    onDelete={() => RemoveNVThucHien(cthd, nv)}
                                                                />
                                                            ))}
                                                        {(cthd?.nhanVienThucHien?.length ?? 0) > 2 && (
                                                            <Chip
                                                                sx={{ backgroundColor: 'var(--color-bg)' }}
                                                                label={`${(cthd?.nhanVienThucHien?.length ?? 0) - 2} +`}
                                                            />
                                                        )}
                                                    </Stack>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} lg={6} md={7}>
                                                <Grid container>
                                                    <Grid item lg={12} width={'100%'}>
                                                        <Stack
                                                            spacing={1}
                                                            direction={'row'}
                                                            alignItems={'center'}
                                                            marginTop={'-12px'}>
                                                            <Stack flex={1} textAlign={'center'} component={'span'}>
                                                                {(cthd?.soLuongConLai ?? 0) > 0 && (
                                                                    <Typography
                                                                        fontWeight={500}
                                                                        variant="body2"
                                                                        component={'span'}>
                                                                        <span>{'/'}</span>
                                                                        <span>{cthd?.soLuongConLai}</span>
                                                                    </Typography>
                                                                )}
                                                            </Stack>
                                                            <Stack flex={6}>
                                                                {(cthd?.tienChietKhau ?? 0) > 0 && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        fontStyle={'italic'}
                                                                        color={'var( --color-text-secondary)'}
                                                                        component={'span'}>
                                                                        Giảm{' '}
                                                                        <Typography
                                                                            component={'span'}
                                                                            variant="caption">
                                                                            {Intl.NumberFormat('vi-VN').format(
                                                                                cthd?.tienChietKhau ?? 0
                                                                            )}
                                                                        </Typography>
                                                                    </Typography>
                                                                )}
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                            </Stack>
                        </Stack>
                        <Stack
                            zIndex={4}
                            sx={{
                                backgroundColor: 'rgb(245 241 241)',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 'auto',
                                padding: '16px',
                                boxSizing: 'border-box'
                            }}>
                            <Stack spacing={2}>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>
                                            Tổng thanh toán
                                        </Typography>
                                        <MoreOutlinedIcon
                                            titleAccess="Nhập giảm giá hóa đơn"
                                            sx={{ color: 'var(--color-text-secondary)' }}
                                            onClick={(e) => openPopoverGiamGia(e)}
                                        />

                                        {(hoadon?.tongGiamGiaHD ?? 0) > 0 && (
                                            <Typography variant="body2" color={'var(--color-text-secondary)'}>
                                                - {Intl.NumberFormat('vi-VN').format(hoadon?.tongGiamGiaHD ?? 0)}
                                            </Typography>
                                        )}
                                    </Stack>
                                    <Stack spacing={1} alignItems={'center'}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>
                                            {Intl.NumberFormat('vi-VN').format(hoadon?.tongThanhToan ?? 0)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography fontWeight={500}>Tiền khách đưa</Typography>
                                    <RadioGroup
                                        sx={{ display: 'flex', flexDirection: 'row' }}
                                        onChange={(event) => {
                                            const newVal = (event.target as HTMLInputElement).value;
                                            const isTienMat = newVal?.toLocaleLowerCase() === 'true';
                                            setIsThanhToanTienMat(isTienMat);
                                        }}>
                                        <FormControlLabel
                                            value={true}
                                            label={'Tiền mặt'}
                                            checked={isThanhToanTienMat}
                                            control={<Radio size="small" />}
                                        />
                                        <FormControlLabel
                                            sx={{
                                                marginRight: 0
                                            }}
                                            value={false}
                                            label={'Hình thức khác'}
                                            checked={!isThanhToanTienMat}
                                            control={<Radio size="small" />}
                                        />
                                    </RadioGroup>
                                </Stack>
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
                                            fontSize: '18px',
                                            padding: '12px'
                                        }
                                    }}
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setSumTienKhachTra(utils.formatNumberToFloat(event.target.value));
                                    }}
                                />

                                {isSavingHoaDon ? (
                                    <Stack
                                        sx={{
                                            backgroundColor: isThanhToanTienMat ? '#1976d2' : '#e5ebed',
                                            borderRadius: '8px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}
                                        direction={'row'}
                                        spacing={1}>
                                        <CircularProgress />
                                        <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                            ĐANG LƯU
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Stack
                                        sx={{
                                            backgroundColor: isThanhToanTienMat ? '#1976d2' : '#e5ebed',
                                            borderRadius: '8px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}
                                        direction={'row'}
                                        spacing={1}
                                        onClick={saveHoaDon}>
                                        <CheckOutlinedIcon />
                                        <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                            THANH TOÁN
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
