export interface IQuyHoaDonDto {
    id: string;
    idChiNhanh: string;
    idLoaiChungTu: number;
    maHoaDon?: string | null;
    tongTienThu: number;
    ngayLapHoaDon: string;
    trangThai: number;

    noiDungThu?: string | null;
    hachToanKinhDoanh?: boolean;
}

export interface IQuyChiTietDonDto {
    id: string;
    idQuyHoaDon: string;
    idHoaDonLienQuan?: string | null;
    idKhachHang?: string | null;
    idNhanVien?: string | null;
    idTaiKhoanNganHang?: string | null;
    idKhoanThuChi?: string | null;
    laPTChiPhiNganHang?: boolean;
    chiPhiNganHang?: number;
    thuPhiTienGui?: number;
    diemThanhToan?: number;
    hinhThucThanhToan: number;
    tienThu: number;
}
