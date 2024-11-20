import { IFileDto } from '../../dto/FileDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { PageBaoCaoHoaHongChiTiet, PageBaoCaoHoaHongTongHop, ParamSearchBaoCaoHoaHong } from './BaoCaoHoaHongDto';

class BaoCaoHoaHongServices {
    GetBaoCaoHoaHongTongHop = async (
        input: ParamSearchBaoCaoHoaHong
    ): Promise<PagedResultDto<PageBaoCaoHoaHongTongHop>> => {
        const response = await http.post('api/services/app/BaoCao/BaoCaoHoaHongTongHop', input);
        return response.data.result;
    };
    GetBaoCaoHoaHongChiTiet = async (
        input: ParamSearchBaoCaoHoaHong
    ): Promise<PagedResultDto<PageBaoCaoHoaHongChiTiet>> => {
        const response = await http.post('api/services/app/BaoCao/BaoCaoHoaHongChiTiet', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoHoaHongTongHop = async (input: ParamSearchBaoCaoHoaHong): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoHoaHongTongHop', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoHoaHongChiTiet = async (input: ParamSearchBaoCaoHoaHong): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoHoaHongChiTiet', input);
        return response.data.result;
    };
}

export default new BaoCaoHoaHongServices();
