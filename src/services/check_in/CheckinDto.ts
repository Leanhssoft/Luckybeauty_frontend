import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import { format } from 'date-fns';
import { TrangThaiCheckin } from '../../lib/appconst';

export class KHCheckInDto {
    id = '';
    idKhachHang = '';
    idChiNhanh = '';
    dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    ghiChu = '';
    trangThai = TrangThaiCheckin.WAITING; // default
    constructor({
        id = Guid.EMPTY,
        idKhachHang = '',
        idChiNhanh = '',
        dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
        trangThai = TrangThaiCheckin.WAITING
    }) {
        this.id = id;
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.dateTimeCheckIn = dateTimeCheckIn;
        this.trangThai = trangThai;
    }
}

export interface ICheckInHoaDonto {
    idCheckIn: string;
    idHoaDon: string;
    idBooking: string | null;
}

export class PageKhachHangCheckInDto {
    idKhachHang: string | null = null;
    idChiNhanh: string | null = null;
    idCheckIn = Guid.EMPTY;
    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    avatar? = '';
    tongTichDiem? = 0;
    dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd');
    ghiChu? = '';
    trangThaiCheckIn? = 1;
    txtTrangThaiCheckIn? = '';
    tongThanhToan? = 0; // mục đích để chỉ lấy ra ở DS khách hàng checking (get TongThanhToan from cache hoadon)
    loaiHoaDon? = 0; // mục đích để chỉ lấy ra ở DS khách hàng checking (get loaiHoaDon from cache hoadon)

    dateCheckIn? = '';
    timeCheckIn? = '';
    tenKhach_KiTuDau? = '';

    constructor({
        idKhachHang = Guid.EMPTY,
        idChiNhanh = null,
        idCheckIn = Guid.EMPTY,
        dateTimeCheckIn = format(new Date(), 'yyyy-MM-dd'),
        maKhachHang = '',
        tenKhachHang = '',
        soDienThoai = '',
        tongTichDiem = 0,
        ghiChu = '',
        txtTrangThaiCheckIn = 'Đang chờ'
    }) {
        this.idKhachHang = idKhachHang;
        this.idChiNhanh = idChiNhanh;
        this.idCheckIn = idCheckIn;
        this.maKhachHang = maKhachHang;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.tongTichDiem = tongTichDiem;
        this.dateTimeCheckIn = dateTimeCheckIn;
        this.ghiChu = ghiChu;
        this.txtTrangThaiCheckIn = txtTrangThaiCheckIn;

        this._tenKhach_KiTuDau = utils.getFirstLetter(this.tenKhachHang);
        this._dateCheckIn = format(new Date(this.dateTimeCheckIn), 'yyyy-MM-dd');
        this._timeCheckIn = format(new Date(this.dateTimeCheckIn), 'hh:mm a');
    }

    get _dateCheckIn() {
        return format(new Date(this.dateTimeCheckIn), 'yyyy-MM-dd');
    }
    set _dateCheckIn(value: string) {
        this.dateCheckIn = value;
    }
    get _timeCheckIn() {
        return format(new Date(this.dateTimeCheckIn), 'hh:mm a');
    }
    set _timeCheckIn(value: string) {
        this.timeCheckIn = value;
    }
    get _tenKhach_KiTuDau() {
        return utils.getFirstLetter(this.tenKhachHang);
    }
    set _tenKhach_KiTuDau(value: string) {
        this.tenKhach_KiTuDau = value;
    }
    get _dateTimeCheckIn(): string {
        return this.dateTimeCheckIn;
    }
    set _dateTimeCheckIn(value: string) {
        this.dateTimeCheckIn = value;
        this._dateCheckIn = format(new Date(this.dateTimeCheckIn), 'yyyy-MM-dd');
        this._timeCheckIn = format(new Date(this.dateTimeCheckIn), 'hh:mm a');
    }
}
