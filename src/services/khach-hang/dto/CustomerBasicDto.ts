export class CustomerBasicDto {
    idKhachHang: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;
    ngaySinh?: string;

    constructor({ idKhachHang = '', maKhachHang = '', tenKhachHang = '', soDienThoai = '', ngaySinh = '' }) {
        this.idKhachHang = idKhachHang;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.ngaySinh = ngaySinh;
    }
}

export interface ICustomerBasic {
    idKhachHang?: string;
    maKhachHang?: string;
    tenKhachHang?: string;
    soDienThoai?: string;
}
