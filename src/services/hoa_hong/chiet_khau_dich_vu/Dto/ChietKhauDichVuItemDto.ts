export interface ChietKhauDichVuItemDto {
    id: string;
    tenDichVu: string;
    tenNhomDichVu: string;
    hoaHongThucHien: number;
    hoaHongYeuCauThucHien: number;
    hoaHongTuVan: number;
    giaDichVu: number;
    laPhanTram: boolean;
    tenNhanVien: string;
}

export interface ChietKhauDichVuItemDto_TachRiengCot {
    idNhanVien: string;
    idDonViQuiDoi: string;
    idNhomHangHoa?: string | null;
    tenNhanVien: string;
    tenDichVu: string;
    tenNhomDichVu: string;
    hoaHongThucHien: number;
    hoaHongYeuCauThucHien: number;
    hoaHongTuVan: number;
    giaDichVu: number;
    laPhanTram_HoaHongThucHien: boolean;
    laPhanTram_HoaHongYeuCauThucHien: boolean;
    laPhanTram_HoaHongTuVan: boolean;
}
