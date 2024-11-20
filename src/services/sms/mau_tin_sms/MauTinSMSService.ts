import { Guid } from 'guid-typescript';
import utils from '../../../utils/utils';
import http from '../../httpService';
import { MauTinSMSDto, GroupMauTinSMSDto } from './mau_tin_dto';

class MauTinSMSService {
    GetMauTinSMS_byId = async (idMauTin: string): Promise<MauTinSMSDto | null> => {
        if (utils.checkNull(idMauTin) || idMauTin == Guid.EMPTY) {
            return null;
        }
        const xx = await http.get(`api/services/app/MauTinSMS/GetMauTinSMS_byId?id=${idMauTin}`);
        return xx.data.result;
    };
    GetAllMauTinSMS = async (): Promise<MauTinSMSDto[]> => {
        const xx = await http.get(`api/services/app/MauTinSMS/GetAllMauTinSMS`);
        return xx.data.result;
    };
    GetAllMauTinSMS_GroupLoaiTin = async (): Promise<GroupMauTinSMSDto[]> => {
        const xx = await http.get(`api/services/app/MauTinSMS/GetAllMauTinSMS_GroupLoaiTin`);
        return xx.data.result;
    };
    CreateMauTinSMS = async (input: MauTinSMSDto): Promise<MauTinSMSDto> => {
        const xx = await http.post(`api/services/app/MauTinSMS/CreateMauTinSMS`, input);
        return xx.data.result;
    };
    UpdateMauTinSMS = async (input: MauTinSMSDto): Promise<string> => {
        const xx = await http.post(`api/services/app/MauTinSMS/UpdateMauTinSMS`, input);
        return xx.data.result;
    };
}
export default new MauTinSMSService();
