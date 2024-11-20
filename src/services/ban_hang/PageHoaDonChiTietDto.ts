import { Guid } from 'guid-typescript';
import HoaDonChiTietDto from './HoaDonChiTietDto';

export default class PageHoaDonChiTietDto extends HoaDonChiTietDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;
    giaNhap? = 0;
    idNhomHangHoa = null;
    idHangHoa? = null;
    expanded? = false; // sử dụng khi cập nhật chi tiết, mở rộng để xem đầy đủ thông tin giỏ hàng
    tenNVThucHiens = '';
    soLuongConLai? = 0;

    constructor({
        id = Guid.create().toString(),
        maHangHoa = '',
        tenHangHoa = '',
        giaBan = 0,
        giaNhap = 0,
        idNhomHangHoa = null,
        idHangHoa = null,
        idDonViQuyDoi = null,
        soLuong = 1,
        expanded = false,
        trangThai = 3
    }) {
        super({
            id: id,
            idDonViQuyDoi: idDonViQuyDoi,
            soLuong: soLuong,
            donGiaTruocCK: giaBan,
            trangThai: trangThai
        });
        this.maHangHoa = maHangHoa;
        this.tenHangHoa = tenHangHoa;
        this.giaBan = giaBan;
        this.giaNhap = giaNhap;
        this.idNhomHangHoa = idNhomHangHoa;
        this.idHangHoa = idHangHoa;
        this.expanded = expanded;
    }
}
