export interface GetAllQuyHoaDonItemDto {
    id: string;
    idChiNhanh: string;
    loaiPhieu: string;
    maHoaDon: string;
    thoiGianTao: string;
    loaiThuChi: string;
    tongTienThu: number;
    hinhThucThanhToan: string;
    phuongThucTT: string;
    trangThai: string;
    ngayLapHoaDon: string;
    idHoaDonLienQuan: string;
    idBrandname?: string | null;
}
