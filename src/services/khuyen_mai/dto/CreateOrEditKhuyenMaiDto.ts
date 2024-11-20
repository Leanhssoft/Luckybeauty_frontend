export interface CreateOrEditKhuyenMaiDto {
    id: string;
    maKhuyenMai: string;
    tenKhuyenMai: string;
    loaiKhuyenMai: number;
    hinhThucKM: number;
    thoiGianApDung: string;
    thoiGianKetThuc: string;
    tatCaKhachHang: boolean;
    tatCaNhanVien: boolean;
    tatCaChiNhanh: boolean;
    ngayApDungs?: string[];
    thangApDungs?: string[];
    thuApDungs?: string[];
    gioApDungs?: string[];
    idNhanViens?: string[];
    idChiNhanhs?: string[];
    idNhomKhachs?: string[];
    ghiChu?: string;
    trangThai: number;
    khuyenMaiChiTiets: KhuyenMaiChiTiet[];
}
export interface KhuyenMaiChiTiet {
    id: string;
    tongTienHang?: number;
    giamGiaTheoPhanTram?: boolean;
    giamGia?: number;
    idNhomHangMua?: string;
    idDonViQuiDoiMua?: string;
    idNhomHangTang?: string;
    idDonViQuiDoiTang?: string;
    soLuongMua?: number;
    soLuongTang?: number;
    giaKhuyenMai?: number;
    soDiemTang?: number;
    tenNhomHangMua?: string;
    tenNhomHangTang?: string;
    tenHangHoaTang?: string;
    tenHangHoaMua?: string;
}
