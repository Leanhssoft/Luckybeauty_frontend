export interface IGroupChiTietNhatKySuDungGDVDto {
    rowSpan: number;
    idGoiDV: string;
    maGoiDichVu: string;
    ngayMuaGDV: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;
    totalCount: number;

    chitiets: INhatKySuDungGDVDto[];
}

export default interface INhatKySuDungGDVDto {
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;

    maGoiDichVu: string;
    ngayMuaGDV: string;
    maHangHoa: string;
    tenHangHoa: string;
    soLuongMua: number;
    donGiaSauCK: number;
    thanhTienSauCK: number;

    maHoaDonSD: string;
    ngayLapHoaDonSD: string;
    soLuongSD: number;
    giaTriSuDung: number;
    nvthucHiens: string;
}
