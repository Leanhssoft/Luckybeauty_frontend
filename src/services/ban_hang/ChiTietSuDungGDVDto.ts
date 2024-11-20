import PageHoaDonChiTietDto from './PageHoaDonChiTietDto';

export interface GroupChiTietSuDungGDVDto {
    maHoaDon: string;
    ngayLapHoaDon: string;

    chitiets: ChiTietSuDungGDVDto[];
}

export default class ChiTietSuDungGDVDto extends PageHoaDonChiTietDto {
    soLuongMua: number;
    soLuongDung: number;
    soLuongConLai: number;

    constructor({
        maHangHoa = '',
        tenHangHoa = '',
        idNhomHangHoa = null,
        idHangHoa = null,
        idDonViQuyDoi = null,
        trangThai = 3,
        soLuongMua = 0,
        soLuongDung = 0,
        soLuongConLai = 0
    }) {
        super({
            idDonViQuyDoi: idDonViQuyDoi,
            idHangHoa: idHangHoa,
            idNhomHangHoa: idNhomHangHoa,
            maHangHoa: maHangHoa,
            tenHangHoa: tenHangHoa,
            trangThai: trangThai
        });
        this.soLuongMua = soLuongMua;
        this.soLuongDung = soLuongDung;
        this.soLuongConLai = soLuongConLai;
    }
}
