import {
    Avatar,
    Chip,
    CircularProgress,
    Dialog,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { FC, useEffect, useRef, useState } from 'react';
import utils from '../../../utils/utils';
import MenuWithDataFromDB from '../../../components/Menu/MenuWithData_fromDB';
import { CreateOrEditKhachHangDto } from '../../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import PageHoaDonChiTietDto from '../../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../../services/ban_hang/PageHoaDonDto';
import { LoaiChungTu, TrangThaiCheckin } from '../../../lib/appconst';
import { NumericFormat } from 'react-number-format';
import { PropConfirmOKCancel, PropModal } from '../../../utils/PropParentToChild';
import CheckinService from '../../../services/check_in/CheckinService';
import { Guid } from 'guid-typescript';
import { dbDexie } from '../../../lib/dexie/dexieDB';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';
import NhanVienThucHienDto from '../../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import HoaDonChiTietDto from '../../../services/ban_hang/HoaDonChiTietDto';
import { TypeSearchfromDB } from '../../../enum/TypeSearch_fromDB';
import DatePickerCustom from '../../../components/DatetimePicker/DatePickerCustom';
import { IList } from '../../../services/dto/IList';
import { KHCheckInDto } from '../../../services/check_in/CheckinDto';
import HoaDonService from '../../../services/ban_hang/HoaDonService';
import SoQuyServices from '../../../services/so_quy/SoQuyServices';
import { CreateNhatKyThaoTacDto } from '../../../services/nhat_ky_hoat_dong/dto/CreateNhatKyThaoTacDto';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { format } from 'date-fns';
import { InvoiceWaiting, ThuNganSetting } from './main_page_thu_ngan';
import { ModelHangHoaDto } from '../../../services/product/dto';
import khachHangService from '../../../services/khach-hang/khachHangService';
import Cookies from 'js-cookie';
import ConfirmDelete from '../../../components/AlertDialog/ConfirmDelete';
import PaymentsForm from './PaymentsForm';

const ThuNganTabRight: FC<{
    isChoseProduct: number;
    productChosed: ModelHangHoaDto;
    customerIdChosed: string;
    idCheckIn?: string;
    onChangeChiNhanh: (idChiNhanh: string) => void;
}> = ({ isChoseProduct, productChosed, customerIdChosed, idCheckIn, onChangeChiNhanh }) => {
    const firstLoad = useRef(true);
    const [anchorDropdownCustomer, setAnchorDropdownCustomer] = useState<null | HTMLElement>(null);
    const expandSearchCus = Boolean(anchorDropdownCustomer);
    const [isSavingHoaDon, setIsSavingHoaDon] = useState(false);
    const [customerHasGDV, setCustomerHasGDV] = useState(false);
    const [idChiNhanhChosed, setIdChiNhanhChosed] = useState(Cookies.get('IdChiNhanh') ?? '');
    const [isThanhToanTienMat, setIsThanhToanTienMat] = useState(true);
    const [sumTienKhachTra, setSumTienKhachTra] = useState(0);
    const [tienThuaTraKhach, setTienThuaTraKhach] = useState(0);

    const [isShowModalSuDungGDV, setIsShowModalSuDungGDV] = useState(false);
    const [isShowEditGioHang, setIsShowEditGioHang] = useState(false);
    const [isShowModalAddCus, setIsShowModalAddCus] = useState(false);
    const [newCus, setNewCus] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [customerChosed, setCustomerChosed] = useState<CreateOrEditKhachHangDto>({} as CreateOrEditKhachHangDto);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState<PageHoaDonChiTietDto[]>([]);
    const [hoadon, setHoaDon] = useState<PageHoaDonDto>(
        new PageHoaDonDto({
            idKhachHang: null,
            idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
            tenKhachHang: 'Khách lẻ',
            idChiNhanh: idChiNhanhChosed
        })
    );
    const [idCTHDChosing, setIdCTHDChosing] = useState('');
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1, // 1.remove customer, 2.change tabhoadon
        mes: ''
    });
    const [propNVThucHien, setPropNVThucHien] = useState<PropModal>(new PropModal({ isShow: false, isNew: true }));

    const GetInforCustomer_byId = async (cusId: string) => {
        const customer = await khachHangService.getKhachHang(cusId);
        setCustomerChosed(customer);
    };

    const CheckCustomer_hasGDV = async (customerId: string) => {
        const existGDV = await HoaDonService.CheckCustomer_hasGDV(customerId);
        setCustomerHasGDV(existGDV);
    };

    useEffect(() => {
        // firstload: auto set loaiHoadon = HOA_DON_BAN_LE
        InitData_forHoaDon();
    }, [idCheckIn, customerIdChosed]);

    useEffect(() => {
        GetInforCustomer_byId(customerIdChosed);
        CheckCustomer_hasGDV(customerIdChosed);
    }, [customerIdChosed]);

    const InitData_forHoaDon = async () => {
        const idCheckInNew = idCheckIn ?? Guid.EMPTY;
        const hdCache = await dbDexie.hoaDon.where('idCheckIn').equals(idCheckInNew).toArray();
        if (hdCache?.length > 0) {
            setHoaDon({
                ...hdCache[0]
            });
            setHoaDonChiTiet([...(hdCache[0]?.hoaDonChiTiet ?? [])]);
        } else {
            setHoaDon({
                ...hoadon,
                idKhachHang: customerIdChosed,
                idChiNhanh: idChiNhanhChosed,
                idLoaiChungTu: LoaiChungTu.HOA_DON_BAN_LE,
                idCheckIn: idCheckInNew
            });
        }
    };

    useEffect(() => {
        if (isChoseProduct !== 0) {
            choseProduct(productChosed);
        }
    }, [isChoseProduct]);

    const cthd_SumThanhTienTruocCK = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.thanhTienTruocCK ?? 0) + prevValue;
    }, 0);
    const cthd_SumTienChietKhau = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienChietKhau ?? 0) * item.soLuong + prevValue;
    }, 0);
    const cthd_SumTienThue = hoaDonChiTiet?.reduce((prevValue: number, item: PageHoaDonChiTietDto) => {
        return (item?.tienThue ?? 0) * item.soLuong + prevValue;
    }, 0);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        // change cthd --> update hoadon
        const sumThanhTienSauCK = cthd_SumThanhTienTruocCK - cthd_SumTienChietKhau;
        const sumThanhTienSauVAT = sumThanhTienSauCK - cthd_SumTienThue;
        setSumTienKhachTra(sumThanhTienSauVAT);
        setTienThuaTraKhach(0);
        setHoaDon({
            ...hoadon,
            tongTienHangChuaChietKhau: cthd_SumThanhTienTruocCK,
            tongChietKhauHangHoa: cthd_SumTienChietKhau,
            tongTienHang: sumThanhTienSauCK,
            tongTienHDSauVAT: sumThanhTienSauVAT,
            tongThanhToan: sumThanhTienSauVAT - (hoadon?.tongGiamGiaHD ?? 0)
        });
        dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => {
                o.tongTienHangChuaChietKhau = cthd_SumThanhTienTruocCK;
                o.tongChietKhauHangHoa = cthd_SumTienChietKhau;
                o.tongTienHang = sumThanhTienSauCK;
                o.tongTienHDSauVAT = sumThanhTienSauVAT;
                o.tongThanhToan = sumThanhTienSauVAT - (hoadon?.tongGiamGiaHD ?? 0);
            });
        // onUpdate tabchecking (tongmua) todo
    }, [cthd_SumThanhTienTruocCK, cthd_SumTienChietKhau, cthd_SumTienThue]);

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
    const showModalSuDungGDV = async () => {
        setIsShowModalSuDungGDV(true);
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
                    // đang sử dụng hóa đơn --> chuyển sang GDV
                    await AgreeChangeLoaiHoaDon();
                }
                break;
        }
        await ResetCTHD_ifUsingGDV();
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
    const UpdateCTHD_toCache = async (cthdNew: PageHoaDonChiTietDto[]) => {
        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.hoaDonChiTiet = cthdNew));
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
    const removeCTHD = async (item: HoaDonChiTietDto) => {
        setHoaDonChiTiet(hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi));
        const cthd = hoaDonChiTiet?.filter((x) => x?.idDonViQuyDoi !== item?.idDonViQuyDoi);
        await UpdateCTHD_toCache([...cthd]);
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
            // onAddHoaDon_toCache();
        }
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
        idTaiKHoanPos: string | null
    ) => {
        setIsThanhToanTienMat(true);
        const hoadonDB = await saveHoaDon();
        if (hoadonDB) {
            await SoQuyServices.savePhieuThu_forHoaDon({
                idChiNhanh: idChiNhanhChosed,
                phaiTT: hoadon?.tongThanhToan ?? 0,
                thegiatri: tienTheGiaTri,
                tienmat: tienMat,
                tienCK: tienCK,
                tienPOS: tienPOS,
                idTaiKhoanChuyenKhoan: idTaiKhoanCK as null,
                idTaiKhoanPOS: idTaiKHoanPos as null,
                ngayLapHoaDon: hoadonDB?.ngayLapHoaDon,
                hoadon: {
                    maHoaDon: hoadonDB?.maHoaDon,
                    id: (hoadonDB?.id ?? null) as unknown as null,
                    idKhachHang: customerChosed?.id as unknown as null,
                    tenKhachHang: customerChosed?.tenKhachHang
                }
            });
        }
    };

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
                await SoQuyServices.savePhieuThu_forHoaDon({
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
            }

            await dbDexie.hoaDon.where('id').equals(hoadon?.id).delete();

            ResetState_AfterSave();
            return hoadonDB;
        }
    };

    const ResetState_AfterSave = async () => {
        setIsSavingHoaDon(false);
        setIsThanhToanTienMat(true);
        setCustomerHasGDV(false);

        setHoaDonChiTiet([]);
        const newHD = new PageHoaDonDto({
            id: Guid.create().toString(),
            idLoaiChungTu: hoadon?.idLoaiChungTu, // hóa đơn hiện tại đang loại gì, thì reset về loại đó
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

        await dbDexie.hoaDon.add(newHD); // alway add newHD with KhachLe after save
    };

    const addNewInvoice = async () => {
        await ResetState_AfterSave();
    };

    const changeTabHoaDon = async (event: React.SyntheticEvent, tabNew: number) => {
        const check = CheckDangSuDungGDV(2);
        if (!check) {
            return;
        }

        await AgreeChangeLoaiHoaDon(tabNew);
        // onupdate tabchecking - loaihd
    };

    const AgreeChangeLoaiHoaDon = async (loaiHoaDon?: number) => {
        setHoaDon({ ...hoadon, idLoaiChungTu: loaiHoaDon ?? LoaiChungTu.GOI_DICH_VU });

        await dbDexie.hoaDon
            .where('id')
            .equals(hoadon?.id)
            .modify((o: PageHoaDonDto) => (o.idLoaiChungTu = loaiHoaDon ?? LoaiChungTu.GOI_DICH_VU));
    };

    const onChoseInvoiceWaiting = (idWaiting: string) => {
        //setPageThuNgan_IdInvoiceWaiting(idWaiting);
    };

    const changeChiNhanh = async (item: IList) => {
        setIdChiNhanhChosed(item?.id);
        onChangeChiNhanh(item?.id);
    };

    return (
        <>
            <Dialog open={!isThanhToanTienMat} maxWidth="md" fullWidth onClose={() => setIsThanhToanTienMat(true)}>
                <PaymentsForm
                    tongPhaiTra={hoadon?.tongThanhToan ?? 0}
                    onClose={() => setIsThanhToanTienMat(true)}
                    onSaveHoaDon={thanhToanAtPaymentForm}
                />
            </Dialog>
            <Stack position={'relative'} height={'100%'}>
                <ConfirmDelete
                    isShow={confirmDialog.show}
                    title={confirmDialog.title}
                    mes={confirmDialog.mes}
                    onOk={onClickOKConfirm}
                    onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
                />

                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Tabs value={hoadon?.idLoaiChungTu} onChange={changeTabHoaDon} aria-label="nav tabs example">
                            <Tab label="Hóa đơn" value={LoaiChungTu.HOA_DON_BAN_LE} />
                            <Tab label="Gói dịch vụ" value={LoaiChungTu.GOI_DICH_VU} />
                        </Tabs>

                        <IconButton
                            aria-label="add-new-invoice"
                            sx={{ width: 30, height: 30, border: '1px solid #ccc' }}
                            onClick={addNewInvoice}
                            title={
                                hoadon.idLoaiChungTu == LoaiChungTu.HOA_DON_BAN_LE ? 'Thêm hóa đơn' : 'Thêm gói dịch vụ'
                            }>
                            <AddOutlinedIcon />
                        </IconButton>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        {/* <InvoiceWaiting
                        idChiNhanh={idChiNhanhChosed}
                        idLoaiChungTu={pageThuNgan_LoaiHoaDon}
                        onChose={onChoseInvoiceWaiting}
                        isAddNewHD={isAddInvoiceToCache}
                    /> */}
                        <ThuNganSetting idChosed={idChiNhanhChosed} handleChoseChiNhanh={changeChiNhanh} />
                    </Stack>
                </Stack>
                <Stack marginTop={1.5}>
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

                        <Stack overflow={'auto'} zIndex={3} maxHeight={400} paddingBottom={4}>
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
                                                                    <Typography component={'span'} variant="caption">
                                                                        {Intl.NumberFormat('vi-VN').format(
                                                                            cthd?.tienChietKhau ?? 0
                                                                        )}
                                                                    </Typography>
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                {/* <Grid item lg={6}></Grid> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    zIndex={4}
                    sx={{
                        width: '100%',
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
                            <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>Tổng thanh toán</Typography>
                            <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>
                                {Intl.NumberFormat('vi-VN').format(hoadon?.tongTienHang ?? 0)}
                            </Typography>
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
        </>
    );
};

export default ThuNganTabRight;
