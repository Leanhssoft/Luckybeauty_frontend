import { Guid } from 'guid-typescript';
import utils from '../../utils/utils';
import http from '../httpService';
import { TaiKhoanNganHangDto } from './Dto/TaiKhoanNganHangDto';
import axios from 'axios';

class TaiKhoanNganHangServices {
    async GetAllBank() {
        const xx = await http.get(`api/services/app/NganHang/GetAll`);
        return xx.data.result;
    }
    async GetAllBankAccount_Where() {
        const xx = await http.get(`api/services/app/TaiKhoanNganHang/GetAll`);
        return xx.data.result;
    }
    async GetAllBankAccount(idChiNhanh = Guid.EMPTY): Promise<TaiKhoanNganHangDto[]> {
        const xx = await http.get(`api/services/app/TaiKhoanNganHang/GetAllBankAccount?idChiNhanh=${idChiNhanh}`);
        return xx.data.result;
    }
    GetDefault_TaiKhoanNganHang = async (idChiNhanh = Guid.EMPTY): Promise<TaiKhoanNganHangDto> => {
        const xx = await http.get(
            `api/services/app/TaiKhoanNganHang/GetDefault_TaiKhoanNganHang?idChiNhanh=${idChiNhanh}`
        );
        return xx.data.result;
    };
    GetBankAccount_byId = async (idTaiKhoanNganHang = Guid.EMPTY): Promise<TaiKhoanNganHangDto | null> => {
        try {
            const xx = await http.get(
                `api/services/app/TaiKhoanNganHang/GetBankAccount_byId?idTaiKhoanNganHang=${idTaiKhoanNganHang}`
            );
            return xx.data.result;
        } catch (error) {
            return null;
        }
    };
    CreateOrEditBankAccount = async (params: any) => {
        const xx = await http.post(`api/services/app/TaiKhoanNganHang/CreateOrEdit`, params);
        return xx.data.result;
    };
    GetQRCode = async (taiKhoanNganHang: TaiKhoanNganHangDto, tongThanhToan = 0, tenKhachHang = '', maHoaDon = '') => {
        const result = await axios.post(
            'https://api.vietqr.io/v2/generate',
            {
                accountNo: taiKhoanNganHang.soTaiKhoan,
                accountName: taiKhoanNganHang.tenChuThe,
                acqId: taiKhoanNganHang.maPinNganHang,
                addInfo: `${tenKhachHang} thanh toán hóa đơn ${maHoaDon}`,
                amount: tongThanhToan,
                template: 'qr_only'
            },
            {
                headers: {
                    'x-client-id': process.env.CLIENT_ID_VIET_QR,
                    'x-api-key': process.env.API_KEY_VIET_QR,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!utils.checkNull(result.data.data)) return result.data.data.qrDataURL;
        else {
            return '';
        }
    };
}

export default new TaiKhoanNganHangServices();
