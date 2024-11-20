import utils from '../../../utils/utils';
import { PagedRequestDto } from '../../dto/pagedRequestDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { BrandnameDto, IParamSearchBrandname } from './BrandnameDto';

class BrandnameService {
    Brandname_CheckExistSDT = async (phoneNumber: string, id: string) => {
        if (!utils.checkNull(phoneNumber)) {
            const data = await http
                .get(`api/services/app/Brandname/Brandname_CheckExistSDT?phoneNumber=${phoneNumber}&id=${id}`)
                .then((res) => {
                    return res.data.result;
                });
            return data;
        } else {
            return false;
        }
    };
    GetInforBrandnamebyID = async (id: string): Promise<BrandnameDto> => {
        const result = await http.get(`api/services/app/Brandname/GetInforBrandnamebyID?id=${id}`);
        return result.data.result;
    };
    GetListBandname = async (params: IParamSearchBrandname, tenantId = 1): Promise<PagedResultDto<BrandnameDto>> => {
        const result = await http.post(`api/services/app/Brandname/GetListBandname?tenantId=${tenantId}`, params);
        return result.data.result;
    };
    SMS_GetTongSuDung_AllBrandname = async (params: IParamSearchBrandname): Promise<PagedResultDto<BrandnameDto>> => {
        // use to HOST: tongnap + sudung + conlai
        const result = await http.post(`api/services/app/Brandname/SMS_GetTongSuDung_AllBrandname`, params);
        return result.data.result;
    };
    CreateBrandname = async (input: BrandnameDto) => {
        const result = await http.post('api/services/app/Brandname/CreateBrandname', input);
        return result.data.result;
    };
    UpdateBrandname = async (input: BrandnameDto) => {
        const result = await http.post('api/services/app/Brandname/UpdateBrandname', input);
        return result.data.result;
    };
    XoaBrandname = async (id: string) => {
        const result = await http.get('api/services/app/Brandname/XoaBrandname?id=' + id);
        return result.data.result;
    };
    DeleteMultiple_Brandname = async (lstId: any) => {
        const result = await http.post('api/services/app/Brandname/DeleteMultiple_Brandname', lstId);
        return result.data.success;
    };
    ActiveMultiple_Brandname = async (lstId: any) => {
        const result = await http.post('api/services/app/Brandname/ActiveMultiple_Brandname', lstId);
        return result.data.success;
    };
    ExportToExcel_ListBrandname = async (param: PagedRequestDto) => {
        const result = await http.post('api/services/app/Brandname/ExportToExcel_ListBrandname', param);
        return result.data.result;
    };
}

export default new BrandnameService();
