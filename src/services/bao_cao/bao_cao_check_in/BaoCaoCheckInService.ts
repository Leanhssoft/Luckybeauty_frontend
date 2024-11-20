import { IFileDto } from '../../dto/FileDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { IBaoCaoKhachHangCheckIn, ParamSearchBaoCaoCheckIn } from './baoCaoCheckInDto';

class BaoCaoCheckInService {
    GetBaoCaoKhachHang_CheckIn = async (
        input: ParamSearchBaoCaoCheckIn
    ): Promise<PagedResultDto<IBaoCaoKhachHangCheckIn>> => {
        const response = await http.post('api/services/app/BaoCao/GetBaoCaoKhachHang_CheckIn', input);
        return response.data.result;
    };
    ExportToExcel_BaoCaoKhachHang_CheckIn = async (input: ParamSearchBaoCaoCheckIn): Promise<IFileDto> => {
        const response = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoKhachHang_CheckIn', input);
        return response.data.result;
    };
}

export default new BaoCaoCheckInService();
