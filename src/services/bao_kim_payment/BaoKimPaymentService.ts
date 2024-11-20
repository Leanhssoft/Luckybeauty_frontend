import axios from 'axios';
import http from '../httpService';
import { IBankInfor, IResponseThongBaoGiaoDich } from './BaoKimDto';

class BaoKimPaymentServive {
    CreateQRCode = async (): Promise<IBankInfor> => {
        const xx = await http.post(`api/services/app/BaoKimPayment/CreateQRCode`);
        return xx.data.result;
    };
    UpdateQRCode = async (accNo: string): Promise<IBankInfor> => {
        const xx = await http.post(`api/services/app/BaoKimPayment/UpdateQRCode?accNo=${accNo}`);
        return xx.data.result;
    };
    TaoGiaoDich_BaoKim = async (accNo: string, amount: number): Promise<string> => {
        const xx = await http.get(`api/services/app/BaoKimPayment/TaoGiaoDich?accNo=${accNo}&amount=${amount}`);
        return xx.data.result;
    };
    TaoGiaoDich_BaoKim2 = async (accNo: string, amount: number): Promise<string> => {
        const xx = await http.get(
            `https://devtest.baokim.vn/collection/core/Sandbox/Collection/createTrans?accNo=${accNo}&partnerCode=SSOFT&transAmount=${amount}`
        );
        return xx.data.result;
    };
    NhanThongBao_BaoKim = async () => {
        // const xx = await http.get(`https://devtest.baokim.vn/collection/woori_send/Sandbox/Collection/partner`);
        // return xx.data.result;
        const xx = await http.get(`api/services/app/BaoKimPayment/ThongBaoGiaoDich`);
        return xx.data.result;
    };
    GuiLaiThongTinGiaoDich = async (
        input: IResponseThongBaoGiaoDich,
        idHoaDon: string
    ): Promise<IResponseThongBaoGiaoDich> => {
        const xx = await http.post(
            `api/services/app/BaoKimPayment/GuiLaiThongTinGiaoDich_BaoKim?idHoaDon=${idHoaDon}`,
            input
        );
        return xx.data.result;
    };
}
export default new BaoKimPaymentServive();
