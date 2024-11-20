import HoaDonChiTietDto from '../services/ban_hang/HoaDonChiTietDto';
import PageHoaDonChiTietDto from '../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../services/ban_hang/PageHoaDonDto';
import { ChiNhanhDto } from '../services/chi_nhanh/Dto/chiNhanhDto';
import { CuaHangDto } from '../services/cua_hang/Dto/CuaHangDto';
import { KhachHangItemDto } from '../services/khach-hang/dto/KhachHangItemDto';

export class PropModal {
    isShow = false;
    isNew = false;
    id?: string | null = '';
    item?: any = {};
    constructor({ isShow = false, isNew = false, id = '', item = {} }) {
        this.isNew = isNew;
        this.isShow = isShow;
        this.id = id;
        this.item = item;
    }
}

export class PropConfirmOKCancel {
    show = false;
    title = '';
    mes = '';
    type = 1; // ok, 0.err
    constructor({ show = false, title = '', mes = '', type = 0 }) {
        this.show = show;
        this.title = title;
        this.mes = mes;
        this.type = type;
    }
}

export class PropToChildMauIn {
    isPrint = false;
    contentHtml = '';
    hoadon?: PageHoaDonDto;
    hoadonChiTiet?: PageHoaDonChiTietDto[];
    khachhang?: KhachHangItemDto;
    chinhanh?: ChiNhanhDto;
    congty?: CuaHangDto;

    constructor({
        isPrint = false,
        contentHtml = '',
        hoadon = new PageHoaDonDto({ idKhachHang: null }),
        hoadonChiTiet = [new PageHoaDonChiTietDto({ soLuong: 1 })],
        chinhanh = {} as ChiNhanhDto
    }) {
        this.isPrint = isPrint;
        this.contentHtml = contentHtml;
        this.hoadon = hoadon;
        this.hoadonChiTiet = hoadonChiTiet;
        this.chinhanh = chinhanh;
    }
}
