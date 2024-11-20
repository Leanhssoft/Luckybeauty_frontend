import { LoaiTin } from '../../lib/appconst';

export const ZaloTemplateData = [
    {
        id: LoaiTin.TIN_LICH_HEN.toString(),
        idLoaiTin: LoaiTin.TIN_LICH_HEN,
        logo: '',
        tieuDe: 'Xác nhận lịch hẹn',
        noiDung:
            'Cảm ơn quý khách đã đặt lịch sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận với chi tiết như sau:',
        noiDungChiTiet: [
            { key: 'Mã đặt lịch', value: '<SoDienThoai>' },
            { key: 'Họ và tên', value: '<TenKhachHang>' },
            { key: 'Ngày đặt', value: '<BookingDate>' },
            { key: 'Tên dịch vụ', value: '<TenDichVu>' },
            { key: 'Địa chỉ cơ sở', value: '<DiaChiChiNhanh>' }
        ],
        buttons: [{ type: 'oa.open.phone', title: 'Liên hệ CSKH' }]
    },
    {
        id: LoaiTin.TIN_GIAO_DICH.toString(),
        idLoaiTin: LoaiTin.TIN_GIAO_DICH,
        logo: '',
        tieuDe: 'Xác nhận thanh toán',
        noiDung:
            'Xin chào <TenKhachHang>, cảm ơn bạn đã mua hàng tại cửa hàng. Chúng tôi đã ghi nhận thanh toán của bạn với chi tiết như sau:',
        noiDungChiTiet: [
            { key: 'Mã đơn', value: '<MaHoaDon>' },
            { key: 'Ngày mua hàng', value: '<NgayLapHoaDon>' },
            { key: 'Tổng tiền', value: '<TongTienHang>' }
        ],
        buttons: [{ type: 'oa.open.url', title: 'Xem chi tiết đơn hàng' }]
    },
    {
        id: LoaiTin.TIN_SINH_NHAT.toString(),
        idLoaiTin: LoaiTin.TIN_SINH_NHAT,
        logo: '',
        tieuDe: 'Chúc mừng sinh nhật',
        noiDung: 'Chúc <TenKhachHang> có một ngày sinh nhật ý nghĩa bên người thân và gia đình',
        noiDungChiTiet: [],
        buttons: []
    }
];
