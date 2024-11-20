import { Guid } from 'guid-typescript';

export interface KhachHangItemDto {
    id: Guid;
    maKhachHang: string;
    tenKhachHang: string;
    avatar: string;
    soDienThoai: string;
    diaChi: string;
    tenNhomKhach?: string;
    gioiTinh?: string;
    tongChiTieu?: number;
    conNo?: number;
    cuocHenGanNhat: Date;
    tongTichDiem: number;
    soLanCheckIn?: number;
    trangThaiCheckIn?: number;
    zoaUserId?: string;
}
