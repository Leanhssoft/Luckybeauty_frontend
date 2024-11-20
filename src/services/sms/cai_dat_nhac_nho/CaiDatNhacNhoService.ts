import utils from '../../../utils/utils';
import http from '../../httpService';
import { CustomerSMSDto } from '../gui_tin_nhan/gui_tin_nhan_dto';
import { ICaiDatNhacNhoDto, IICaiDatNhacNho_GroupLoaiTin } from './cai_dat_nhac_nho_dto';
import { format } from 'date-fns';

const objSMS = {
    idKhachHang: '',
    maKhachHang: 'KH001',
    tenKhachHang: 'Mai Hương',
    xungHo: 'chị',
    soDienThoai: '0978005006',
    ngaySinh: '1990-11-11',
    bookingCode: 'BK001',
    bookingDate: '11:00 05/04/2024',
    startTime: '11:25 05/04/2024',
    thoiGianHen: '14:00 - 16:00',
    tenHangHoa: 'Cắt tóc',
    maHoaDon: 'HD001',
    ngayLapHoaDon: '10:00 04/04/2024',
    daThanhToan: 1000000,
    ptThanhToan: 'Tiền mặt',
    tenChiNhanh: 'SSOFT HN',
    soDienThoaiChiNhanh: '02437949191',
    diaChiChiNhanh: '31 Lê Văn Lương',
    tenCuaHang: 'SSOFT Việt Nam',
    diaChiCuaHang: 'Dịch Vọng Hậu',
    dienThoaiCuaHang: '0978555444'
} as CustomerSMSDto;

class CaiDatNhacNhoService {
    objSMS = objSMS;
    ReplaceBienSMS = (input: string): string => {
        let txt = input;
        if (utils.checkNull(txt)) return '';
        txt = txt.replaceAll('{TenKhachHang}', this.objSMS?.tenKhachHang ?? '');
        txt = txt.replaceAll('{SoDienThoai}', this.objSMS?.soDienThoai ?? '');
        txt = txt.replaceAll('{XungHo}', this.objSMS?.xungHo ?? '');
        if (!utils.checkNull(this.objSMS?.ngaySinh as unknown as string)) {
            txt = txt.replace('{NgaySinh}', format(new Date(this.objSMS?.ngaySinh ?? new Date()), 'dd/MM/yyyy'));
        } else {
            txt = txt.replace('{NgaySinh}', '');
        }
        if (!utils.checkNull(this.objSMS?.bookingDate as unknown as string)) {
            txt = txt.replace(
                '{BookingDate}',
                format(new Date(this.objSMS?.startTime ?? new Date()), 'HH:mm dd/MM/yyyy')
            );
        }
        txt = txt.replace('{BookingCode}', this.objSMS?.bookingCode ?? '');
        txt = txt.replace('{ThoiGianHen}', this.objSMS?.thoiGianHen ?? '');
        txt = txt.replace('{MaHoaDon}', this.objSMS?.maHoaDon ?? '');
        if (!utils.checkNull(this.objSMS?.ngayLapHoaDon as unknown as string)) {
            txt = txt.replace(
                '{NgayLapHoaDon}',
                format(new Date(this.objSMS?.ngayLapHoaDon ?? new Date()), 'HH:mm dd/MM/yyyy')
            );
        }
        txt = txt.replace('{TenDichVu}', this.objSMS?.tenHangHoa ?? '');
        txt = txt.replace('{TenCuaHang}', this.objSMS?.tenCuaHang ?? '');
        txt = txt.replace('{DienThoaiCuaHang}', this.objSMS?.dienThoaiCuaHang ?? '');
        txt = txt.replace('{DiaChiCuaHang}', this.objSMS?.dienThoaiCuaHang ?? '');
        txt = txt.replace('{TenChiNhanh}', this.objSMS?.tenChiNhanh ?? '');
        txt = txt.replace('{DienThoaiChiNhanh}', this.objSMS?.soDienThoaiChiNhanh ?? '');
        txt = txt.replace('{DiaChiChiNhanh}', this.objSMS?.diaChiChiNhanh ?? '');
        txt = txt.replace('{TongTienHang}', new Intl.NumberFormat('vi-VN').format(this.objSMS?.tongThanhToan ?? 0));
        txt = txt.replace('{DaThanhToan}', new Intl.NumberFormat('vi-VN').format(this.objSMS?.daThanhToan ?? 0));
        txt = txt.replace('{PTThanhToan}', this.objSMS?.ptThanhToan ?? '');
        return txt;
    };
    GetAllCaiDatNhacNho = async (): Promise<ICaiDatNhacNhoDto[] | null> => {
        const xx = await http.get(`api/services/app/CaiDatNhacNho/GetAllCaiDat`);
        return xx.data.result;
    };
    GetAllCaiDatNhacNho_GroupLoaiTin = async (): Promise<IICaiDatNhacNho_GroupLoaiTin[] | null> => {
        const xx = await http.get(`api/services/app/CaiDatNhacNho/GetAllCaiDatNhacNho_GroupLoaiTin`);
        return xx.data.result;
    };
    GetInforCaiDatNhacNho_byId = async (idSetup: string): Promise<ICaiDatNhacNhoDto> => {
        const xx = await http.get(
            `api/services/app/CaiDatNhacNho/GetInforCaiDatNhacNho_byId?idCaiDatNhacNho=${idSetup}`
        );
        return xx.data.result;
    };
    CreateCaiDatNhacNho = async (input: ICaiDatNhacNhoDto): Promise<ICaiDatNhacNhoDto> => {
        const xx = await http.post(`api/services/app/CaiDatNhacNho/CreateCaiDatNhacNho`, input);
        return xx.data.result;
    };
    UpdateCaiDatNhacNho = async (input: ICaiDatNhacNhoDto): Promise<string> => {
        const xx = await http.post(`api/services/app/CaiDatNhacNho/UpdateCaiDatNhacNho`, input);
        return xx.data.result;
    };
}
export default new CaiDatNhacNhoService();
