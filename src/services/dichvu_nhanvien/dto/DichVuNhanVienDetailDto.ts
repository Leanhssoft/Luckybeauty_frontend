export interface DichVuNhanVienDetailDto {
    tenNhanVien: string;
    avatar: string;
    chucVu: string;
    soDienThoai: string;
    email: string;
    rate: number;
    dichVuThucHiens: DichVuNhanVienThucHien[];
}
export interface DichVuNhanVienThucHien {
    idDichVu: string;
    tenDichVu: string;
    avatar: string;
    donGia: number;
    soPhutThucHien: string;
}
