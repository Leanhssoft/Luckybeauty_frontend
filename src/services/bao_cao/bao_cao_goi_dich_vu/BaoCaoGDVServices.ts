import { IGroupChiTietNhatKySuDungGDVDto } from '../../ban_hang/NhatKySuDungGDVDto';
import { IFileDto } from '../../dto/FileDto';
import { RequestFromToDto } from '../../dto/ParamSearchDto';
import http from '../../httpService';

class BaoCaoGDVServices {
    GetBaoCaoSuDungGDV_ChiTiet = async (input: RequestFromToDto): Promise<IGroupChiTietNhatKySuDungGDVDto[] | null> => {
        const response = await http.post('api/services/app/BaoCao/BaoCaoSuDungGDV_ChiTiet', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoSuDungGDVChiTiet = async (input: RequestFromToDto): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoSuDungGDVChiTiet', input);
        return response.data.result;
    };
}
export default new BaoCaoGDVServices();
