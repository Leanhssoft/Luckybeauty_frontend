import { Guid } from 'guid-typescript';
import QuyChiTietDto from './QuyChiTietDto';
import { format, add, addDays } from 'date-fns';
import { LoaiChungTu, TrangThaiActive } from '../../lib/appconst';

export default class QuyHoaDonDto {
    id = Guid.create().toString();
    idChiNhanh?: string;
    idBrandname?: string;
    idNhanVien?: string | null = null;
    idLoaiChungTu = LoaiChungTu.PHIEU_THU;
    maHoaDon? = '';
    tongTienThu = 0;
    ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    trangThai? = 1;

    noiDungThu? = '';
    hachToanKinhDoanh? = true;
    thuPhiTienGui? = 0;
    diemThanhToan? = 0;

    quyHoaDon_ChiTiet?: QuyChiTietDto[];

    idHoaDonLienQuan?: string | null;
    idDoiTuongNopTien?: string | null = null;
    loaiDoiTuong? = 1; // khachhang
    hinhThucThanhToan? = 1; // tienmat
    idKhoanThuChi?: string | null = null;
    idTaiKhoanNganHang?: string | null = null;

    loaiPhieu? = '';
    maNguoiNop? = '';
    tenNguoiNop? = '';
    sdtNguoiNop? = '';
    tenChiNhanh? = '';
    tenNhanVien? = '';
    txtTrangThai? = '';
    sHinhThucThanhToan? = '';
    tenKhoanThuChi? = '';
    tenNganHang? = '';
    tenChuThe? = '';

    maHoaDonLienQuans? = '';
    tienMat? = 0;
    tienChuyenKhoan? = 0;
    tienQuyetThe? = 0;

    sumTienMat? = 0;
    sumTienChuyenKhoan? = 0;
    sumTienQuyetThe? = 0;
    sumTongTienThu? = 0;
    sumTongTienChi? = 0;
    sumTongThuChi? = 0;

    constructor({
        id = Guid.create().toString(),
        idLoaiChungTu = LoaiChungTu.PHIEU_THU,
        trangThai = TrangThaiActive.ACTIVE,
        idChiNhanh = '',
        idBrandname = '',
        maHoaDon = '',
        idNhanVien = null,
        idDoiTuongNopTien = null,
        ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
        tongTienThu = 0,
        noiDungThu = '',
        hachToanKinhDoanh = true,
        thuPhiTienGui = 0,
        diemThanhToan = 0,
        hinhThucThanhToan = 1,
        idKhoanThuChi = null
    }) {
        this.id = id;
        this.idLoaiChungTu = idLoaiChungTu;
        this.trangThai = trangThai;
        this.idChiNhanh = idChiNhanh;
        this.idBrandname = idBrandname;
        this.maHoaDon = maHoaDon;
        this.idNhanVien = idNhanVien;
        this.idDoiTuongNopTien = idDoiTuongNopTien;
        this.ngayLapHoaDon = ngayLapHoaDon;
        this.tongTienThu = tongTienThu;
        this.noiDungThu = noiDungThu;
        this.hachToanKinhDoanh = hachToanKinhDoanh;
        this.thuPhiTienGui = thuPhiTienGui;
        this.diemThanhToan = diemThanhToan;
        this.hinhThucThanhToan = hinhThucThanhToan;
        this.idKhoanThuChi = idKhoanThuChi;
        this.quyHoaDon_ChiTiet = [];

        Object.defineProperties(this, {
            loaiPhieu: {
                get() {
                    let txt = '';
                    switch (this.idLoaiChungTu) {
                        case 11:
                            txt = 'Phiếu thu';
                            break;
                        case 12:
                            txt = 'Phiếu chi';
                            break;
                    }
                    return txt;
                }
            },
            txtTrangThai: {
                get() {
                    let txt = '';
                    switch (this.trangThai) {
                        case 1:
                            txt = 'Đã thanh toán';
                            break;
                        case 0:
                            txt = 'Đã hủy';
                            break;
                    }
                    return txt;
                }
            },
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
                            txt = 'Thẻ giá trị';
                            break;
                    }
                    return txt;
                }
            }
        });
    }
}
