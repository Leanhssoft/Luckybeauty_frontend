import NhanSuDto from '../nhan-vien/dto/nhanSuDto';
export default class NhanVienThucHienDto extends NhanSuDto {
    idHoaDon?: string | null = null;
    idHoaDonChiTiet?: string | null = null;
    idQuyHoaDon?: string | null = null;
    idNhanVien? = '';
    ptChietKhau = 0;
    tienChietKhau = 0;
    heSo = 1;
    chiaDeuChietKhau = false;
    tinhHoaHongTruocCK = false;
    loaiChietKhau = 1; // nvThucHien
    chietKhauMacDinh? = 0;
    laPhanTram = true;
    constructor({
        idHoaDon = null,
        idHoaDonChiTiet = null,
        idNhanVien = '',
        ptChietKhau = 0,
        laPhanTram = true,
        tienChietKhau = 0,
        heSo = 1,
        chiaDeuChietKhau = false,
        tinhHoaHongTruocCK = false,
        loaiChietKhau = 1,
        chietKhauMacDinh = 0,
        maNhanVien = '',
        tenNhanVien = '',
        soDienThoai = '',
        gioiTinh = 1,
        avatar = ''
    }) {
        super();
        this.idHoaDon = idHoaDon;
        this.idHoaDonChiTiet = idHoaDonChiTiet;
        this.idNhanVien = idNhanVien;
        this.laPhanTram = laPhanTram;
        this.ptChietKhau = ptChietKhau;
        this.tienChietKhau = tienChietKhau;
        this.heSo = heSo;
        this.chiaDeuChietKhau = chiaDeuChietKhau;
        this.tinhHoaHongTruocCK = tinhHoaHongTruocCK;
        this.loaiChietKhau = loaiChietKhau;
        this.chietKhauMacDinh = chietKhauMacDinh;
        this.maNhanVien = maNhanVien;
        this.tenNhanVien = tenNhanVien;
        this.soDienThoai = soDienThoai;
        this.gioiTinh = gioiTinh;
        this.avatar = avatar;
    }
}
