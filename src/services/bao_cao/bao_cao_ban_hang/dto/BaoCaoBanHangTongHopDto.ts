export interface BaoCaoBanHangTongHopDto extends IBaoCaoBanHang_SumFooterDto {
    tenHangHoa: string;
    maHangHoa: string;
    tenNhomHang: string;
    soLuong: number;
    tienChietKhau?: number;
    thanhTienTruocCK?: number;
    thanhTienSauCK: number; // sau ck, truoc VAT
}

export interface IBaoCaoBanHang_SumFooterDto {
    sumSoLuong?: number;
    sumTienChietKhau?: number;
    sumThanhTienTruocCK?: number;
    sumThanhTienSauCK?: number;
}
