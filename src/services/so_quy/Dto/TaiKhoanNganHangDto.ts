export interface NganHangDto {
    id: string;
    maNganHang: string;
    tenNganHang: string;
    bin: string;
    logo: string;
    tenRutGon: string;
}

export interface TaiKhoanNganHangDto {
    id: string;
    tenChuThe: string;
    soTaiKhoan: string;
    idNganHang: string;
    ghiChu?: string;
    trangThai?: number;

    maNganHang: string;
    tenNganHang: string;
    logoNganHang: string;
    maPinNganHang: string;
    tenRutGon: string;
    isDefault?: boolean;
}
