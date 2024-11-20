import { IBaoCaoBanHang_SumFooterDto } from './BaoCaoBanHangTongHopDto';

export interface BaoCaoBanHangChiTietDto extends IBaoCaoBanHang_SumFooterDto {
    maHoaDon: string;
    ngayLapHoaDon: string;
    tenKhachHang: string;
    soDienThoai: string;
    tenNhomHang: string;
    maHangHoa: string;
    tenHangHoa: string;
    soLuong: number;
    donGiaTruocCK?: number;
    thanhTienTruocCK?: number;
    tienChietKhau?: number;
    thanhTienSauCK: number;
}
