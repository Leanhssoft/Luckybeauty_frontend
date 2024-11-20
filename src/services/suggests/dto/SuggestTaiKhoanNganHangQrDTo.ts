export interface SuggestTaiKhoanNganHangQrDto {
    id: string | null; // idTaikhoan: save to quyCT
    soTaiKhoan: string;
    tenTaiKhoan: string;
    bin: string;
    tenRutGon: string;
    isDefault?: boolean;
}
