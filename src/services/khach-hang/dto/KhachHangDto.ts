import { Guid } from 'guid-typescript';
import { CreateOrEditKhachHangDto } from './CreateOrEditKhachHangDto';

export interface KhachHangDto {
    id: Guid;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    isDeleted: boolean;
    deleterUserId: number;
    deletionTime: Date;
    tenantId: number;
    maKhachHang: string;
    tenKhachHang: string;
    tenKhachHang_KhongDau: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinhNam: boolean;
    email: string;
    moTa: string;
    trangThai: number;
    tongTichDiem: number;
    maSoThue: string;
    avatar: string;
    ngaySinh: Date;
    kieuNgaySinh: number;
    idLoaiKhach: number;
    loaiKhach: LoaiKhach;
    idNhomKhach: Guid;
    nhomKhach: NhomKhach;
    idNguonKhach: Guid;
    nguonKhach: NguonKhach;
    idTinhThanh: Guid;
    idQuanHuyen: Guid;
    nguoiTao: string;
    nguoiSua: string;
    nguoiXoa: string;
}

export interface ICustomerDetail_FullInfor extends CreateOrEditKhachHangDto {
    tenLoaiKhachHang?: string;
    tenNguonKhach?: string;
    tenNhomKhach?: string;
    soLanBooking?: number;
    soLanCheckIn?: number;
    tongChiTieu?: number;
    conNo?: number;
    cuocHenGanNhat?: Date;
}

export interface LoaiKhach {
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    isDeleted: boolean;
    deleterUserId: number;
    deletionTime: Date;
    id: number;
    tenantId: number;
    maLoaiKhachHang: string;
    tenLoaiKhachHang: string;
    trangThai: number;
    nguoiTao: string;
    nguoiSua: string;
    nguoiXoa: string;
}

export interface NguonKhach {
    id: Guid;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    isDeleted: boolean;
    deleterUserId: number;
    deletionTime: Date;
    tenantId: number;
    maNguon: string;
    tenNguon: string;
    trangThai: number;
    nguoiTao: string;
    nguoiSua: string;
    ngayTao: Date;
    ngaySua: Date;
    nguoiXoa: string;
    ngayXoa: Date;
}

export interface NhomKhach {
    id: Guid;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    isDeleted: boolean;
    deleterUserId: number;
    deletionTime: Date;
    tenantId: number;
    maNhomKhach: string;
    tenNhomKhach: string;
    giamGia: number;
    laPhamTram: boolean;
    tuDongCapNhat: boolean;
    moTa: string;
    trangThai: number;
    nguoiTao: string;
    nguoiSua: string;
    nguoiXoa: string;
}
