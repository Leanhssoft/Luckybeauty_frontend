import { IHoaDonChiTiet_UseForBaoCao } from '../../ban_hang/HoaDonChiTietDto';
import { RequestFromToDto } from '../../dto/ParamSearchDto';
import { IHangHoaInfor_UseForBaoCao } from '../../product/dto';

export interface PageBaoCaoHoaHongTongHop {
    idNhanVien: string;
    maNhanVien: string;
    tenNhanVien: string;
    hoaHongThucHien_TienChietKhau: number;
    hoaHongTuVan_TienChietKhau: number;
    tongHoaHong: number;

    sumHoaHongTuVan?: number;
    sumHoaHongThucHien?: number;
    sumTongHoaHong?: number;
}
export interface IHoaHongChiTiet_ListDetail {
    maNhanVien: string;
    tenNhanVien: string;
    hoaHongThucHien_PTChietKhau: number;
    hoaHongTuVan_PTChietKhau: number;
    hoaHongThucHien_TienChietKhau: number;
    hoaHongTuVan_TienChietKhau: number;
    tongHoaHong: number;
}
export interface PageBaoCaoHoaHongChiTiet extends IHangHoaInfor_UseForBaoCao, IHoaDonChiTiet_UseForBaoCao {
    idHoaDonChiTiet: string;
    maHoaDon: string;
    ngayLapHoaDon: string;
    maKhachHang: string;
    tenKhachHang: string;
    rowSpan: number;

    sumSoLuong?: number;
    sumThanhTienSauCK?: number;
    sumHoaHongTuVan?: number;
    sumHoaHongThucHien?: number;
    sumTongHoaHong?: number;
    lstDetail: IHoaHongChiTiet_ListDetail[];
}

export class ParamSearchBaoCaoHoaHong extends RequestFromToDto {
    idLoaiChungTus?: string[];
    idNhomHangs?: string[];

    constructor({
        idChiNhanhs = [''],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        idLoaiChungTus = [''],
        idNhomHangs = ['']
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort,
            fromDate: fromDate,
            toDate: toDate
        });
        this.idLoaiChungTus = idLoaiChungTus;
        this.idNhomHangs = idNhomHangs;
    }
}
