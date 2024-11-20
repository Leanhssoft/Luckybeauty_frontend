import { Guid } from 'guid-typescript';

export default class QuyChiTietDto {
    id = Guid.create().toString();
    idQuyHoaDon = Guid.createEmpty().toString();
    idHoaDonLienQuan?: string | null = null;
    idKhachHang?: string | null = null;
    idNhanVien?: string | null = null;
    idTaiKhoanNganHang?: string | null = null;
    idKhoanThuChi?: string | null = null;
    laPTChiPhiNganHang? = 0;
    chiPhiNganHang? = 0;
    thuPhiTienGui? = 0;
    diemThanhToan? = 0;
    hinhThucThanhToan = 1;
    tienThu = 0;

    tenChuThe? = '';
    soTaiKhoan? = '';
    tenNganHang? = '';
    tenKhoanThuChi? = '';
    sHinhThucThanhToan? = '';
    maHoaDonLienQuan? = '';
    maPinNganHang? = '';

    constructor({
        id = Guid.create().toString(),
        idHoaDonLienQuan = null,
        idKhachHang = null,
        idNhanVien = null,
        idTaiKhoanNganHang = null,
        idKhoanThuChi = null,
        laPTChiPhiNganHang = 0,
        chiPhiNganHang = 0,
        thuPhiTienGui = 0,
        diemThanhToan = 0,
        hinhThucThanhToan = 1,
        tienThu = 0,
        tenChuThe = '',
        soTaiKhoan = '',
        tenNganHang = '',
        tenKhoanThuChi = '',
        maPinNganHang = ''
    }) {
        this.id = id;
        this.idHoaDonLienQuan = idHoaDonLienQuan;
        this.idKhachHang = idKhachHang;
        this.idNhanVien = idNhanVien;
        this.idTaiKhoanNganHang = idTaiKhoanNganHang;
        this.idKhoanThuChi = idKhoanThuChi;
        this.laPTChiPhiNganHang = laPTChiPhiNganHang;
        this.chiPhiNganHang = chiPhiNganHang;
        this.thuPhiTienGui = thuPhiTienGui;
        this.diemThanhToan = diemThanhToan;
        this.hinhThucThanhToan = hinhThucThanhToan;
        this.tienThu = tienThu;

        this.tenChuThe = tenChuThe;
        this.soTaiKhoan = soTaiKhoan;
        this.tenNganHang = tenNganHang;
        this.tenKhoanThuChi = tenKhoanThuChi;
        this.maPinNganHang = maPinNganHang;

        Object.defineProperties(this, {
            sHinhThucThanhToan: {
                get() {
                    let txt = '';
                    switch (this.hinhThucThanhToan) {
                        case 1:
                            txt = 'Tiền mặt';
                            break;
                        case 2:
                            txt = 'Pos';
                            break;
                        case 3:
                            txt = 'Chuyển khoản';
                            break;
                        case 4:
                            txt = 'Tiền mặt';
                            break;
                        case 5:
                            txt = 'Thẻ giá trị';
                            break;
                        case 6:
                            txt = 'Sử dụng điểm';
                            break;
                    }
                    return txt;
                }
            }
        });
    }
}
