export interface CreateOrEditChietKhauHoaDonDto {
    id: string;
    idChiNhanh: string;
    loaiChietKhau: number;
    giaTriChietKhau: number;
    chungTuApDung: string;
    idNhanViens: string[];
    ghiChu: string;
}
