import { Guid } from 'guid-typescript';
import { KhachHangItemDto } from '../khach-hang/dto/KhachHangItemDto';
import HoaDonDto from './HoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import { format } from 'date-fns';
import { LoaiChungTu } from '../../lib/appconst';

export default class PageHoaDonDto extends HoaDonDto {
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai!: string;
    tongTichDiem = 0;
    avatar = '';

    maNhanVien = '';
    tenNhanVien = '';

    userName = ''; // user lap phieu
    tenChiNhanh = '';
    idCheckIn = ''; // 1 khách hàng có thể check in nhiều lần cùng lúc, và tạo nhiều hóa đơn # nhau (phân biệt cache dexieDB)

    daThanhToan? = 0;
    conNo? = 0;
    txtTrangThaiHD = 'Hoàn thành';
    hoaDonChiTiet?: PageHoaDonChiTietDto[];

    // used to at DS hoadon: footer
    sumTongTienHang?: number;
    sumTongGiamGiaHD?: number;
    sumTongThanhToan?: number;
    sumDaThanhToan?: number;

    constructor({
        id = Guid.create().toString(),
        idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE,
        idKhachHang = null,
        idChiNhanh = '',
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        txtTrangThaiHD = 'Hoàn thành',
        maNhanVien = '',
        tenNhanVien = '',
        maHoaDon = '',
        ngayLapHoaDon = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
        tongTienHang = 0,
        daThanhToan = 0,
        tongTienThue = 0,
        ptGiamGiaHD = 0,
        tongGiamGiaHD = 0
    }) {
        super({
            id: id,
            idLoaiChungTu,
            idKhachHang: idKhachHang,
            idChiNhanh: idChiNhanh,
            maHoaDon: maHoaDon,
            ngayLapHoaDon: ngayLapHoaDon,
            tongTienHang: tongTienHang,
            tongTienThue: tongTienThue,
            pTGiamGiaHD: ptGiamGiaHD,
            tongGiamGiaHD: tongGiamGiaHD
        });
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.tongTichDiem = tongTichDiem;
        this.txtTrangThaiHD = txtTrangThaiHD;
        this.maNhanVien = maNhanVien;
        this.tenNhanVien = tenNhanVien;
        this.daThanhToan = daThanhToan;
        this.hoaDonChiTiet = [];
        this.idCheckIn = Guid.EMPTY;
    }
}
