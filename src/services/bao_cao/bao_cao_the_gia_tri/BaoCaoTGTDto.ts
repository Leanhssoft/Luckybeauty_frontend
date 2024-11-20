import { ICustomerBasic } from '../../khach-hang/dto/CustomerBasicDto';

export interface IBaocaoNhatKySuDungTGT extends ICustomerBasic {
    idLoaiChungTu: number;
    sLoaiChungTu: number;
    maHoaDon: string;
    ngayLapHoaDon: string;
    gtriDieuChinh: number;
    phatSinhTang: number;
    phatSinhGiam: number;
}
