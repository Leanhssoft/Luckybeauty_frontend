export interface CreateOrEditCaLamViecDto {
    id: string;
    idChiNhanh: string;
    maCa: string;
    tenCa: string;
    gioVao: string;
    gioRa: string;
    tongSoGioCong: number;
    gioNghiTu?: string;
    gioNghiDen?: string;
    laNghiGiuaCa: boolean;
}
