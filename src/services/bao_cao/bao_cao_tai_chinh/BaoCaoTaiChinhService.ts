import { IFileDto } from '../../dto/FileDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { IBaoCaoChiTietCongNo, IBaoCaoTaiChinh_ChiTietSoQuy, ParamSearchBaoCaoTaiChinh } from './BaoCaoTaiChinhDto';

class BaoCaoTaiChinhService {
    GetBaoCaoTaichinh_ChiTietSoQuy = async (
        input: ParamSearchBaoCaoTaiChinh
    ): Promise<PagedResultDto<IBaoCaoTaiChinh_ChiTietSoQuy>> => {
        const response = await http.post('api/services/app/BaoCao/GetBaoCaoTaichinh_ChiTietSoQuy', input);
        return response.data.result;
    };
    GetBaoCaoChiTietCongNo = async (
        input: ParamSearchBaoCaoTaiChinh
    ): Promise<PagedResultDto<IBaoCaoChiTietCongNo>> => {
        const response = await http.post('api/services/app/BaoCao/GetBaoCaoChiTietCongNo', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoTaichinh_ChiTietSoQuy = async (input: ParamSearchBaoCaoTaiChinh): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoTaichinh_ChiTietSoQuy', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoChiTietCongNo = async (input: ParamSearchBaoCaoTaiChinh): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoChiTietCongNo', input);
        return response.data.result;
    };
}

export default new BaoCaoTaiChinhService();
