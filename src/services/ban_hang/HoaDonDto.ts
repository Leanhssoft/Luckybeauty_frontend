import { Guid } from 'guid-typescript';
import PageHoaDonChiTietDto from './PageHoaDonChiTietDto';
import { format } from 'date-fns';
import { LoaiChungTu } from '../../lib/appconst';

export default class HoaDonDto {
    id = Guid.create().toString();
    idKhachHang: string | null = null;
    idChiNhanh?: string;
    idNhanVien? = null;
    idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE;
    maHoaDon = '';
    ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');

    tongTienHang = 0;
    pTGiamGiaHD? = 0;
    tongGiamGiaHD = 0;

    tongThanhToan = 0;
    ghiChuHD? = '';
    trangThai? = 3; // 0.Xóa, 1.Tạm lưu, 2.Đang xử lý, 3.Hoàn thành

    tongTienHangChuaChietKhau = 0;
    tongChietKhauHangHoa = 0;

    ptThueHD? = 0;
    tongTienThue? = 0;
    tongTienHDSauVAT? = 0;
    laHoaDonDauKy? = false;
    hoaDonChiTiet?: PageHoaDonChiTietDto[];

    constructor({
        id = Guid.create().toString(),
        idLoaiChungTu = 1,
        idKhachHang = null,
        idChiNhanh = '',
        idNhanVien = null,
        maHoaDon = '',
        ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
        tongTienHangChuaChietKhau = 0,
        tongChietKhauHangHoa = 0,
        tongTienHang = 0,
        pTGiamGiaHD = 0,
        tongGiamGiaHD = 0,
        ptThueHD = 0,
        tongTienThue = 0,
        tongTienHDSauVAT = 0,
        tongThanhToan = 0,
        ghiChuHD = '',
        trangThai = 3
    }) {
        this.id = id;
        this.idLoaiChungTu = idLoaiChungTu;
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idNhanVien = idNhanVien;
        this.maHoaDon = maHoaDon;
        this.ngayLapHoaDon = ngayLapHoaDon;
        this.tongTienHangChuaChietKhau = tongTienHangChuaChietKhau;
        this.tongChietKhauHangHoa = tongChietKhauHangHoa;
        this.tongTienHang = tongTienHang;
        this.pTGiamGiaHD = pTGiamGiaHD;
        this.tongGiamGiaHD = tongGiamGiaHD;
        this.tongThanhToan = tongThanhToan;
        this.ghiChuHD = ghiChuHD;
        this.trangThai = trangThai;
        this.ptThueHD = ptThueHD;
        this.tongTienThue = tongTienThue;
        this.tongTienHDSauVAT = tongTienHDSauVAT;
    }
}
