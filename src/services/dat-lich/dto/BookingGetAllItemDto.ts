import { ModelHangHoaDto } from '../../product/dto';

export interface BookingGetAllItemDto {
    id: string; // idbooking
    idNhanVien: string;
    startTime: string;
    endTime: string;
    bookingDate: Date;
    tenDichVu: string;
    dayOfWeek: string;
    maKhachHang: string;
    tenKhachHang: string;
    soDienThoai: string;
    nhanVienThucHien: string;
    tenChucVu: string;
    avatar: string; // ảnh nhân viên
    color: string;
    ghiChu: string;
    trangThai: number;
}
export class BookingDetailDto extends ModelHangHoaDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;
}

export class BookingDetail_ofCustomerDto {
    idBooking = '';
    idChiNhanh = '';
    idKhachHang = '';
    avatar = '';
    startTime = '';
    endTime = '';
    bookingDate = '';
    trangThai = 1;

    maKhachHang = '';
    tenKhachHang = '';
    soDienThoai = '';
    txtTrangThaiBook = '';

    tenChiNhanh = '';
    soDienThoaiChiNhanh = '';
    diaChiChiNhanh = '';

    details: BookingDetailDto[] = [];
}
