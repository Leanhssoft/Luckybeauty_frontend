export interface CreateBookingDto {
    id: string;
    bookingCode?: string;
    startHours: string;
    startTime: string;
    trangThai: number;
    ghiChu: string;
    idKhachHang: string;
    idNhanVien: string | null;
    idDonViQuiDoi: string;
    idChiNhanh: string;
}
