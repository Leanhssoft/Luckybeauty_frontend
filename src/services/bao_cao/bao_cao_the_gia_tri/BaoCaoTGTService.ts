import { IFileDto } from '../../dto/FileDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { IBaocaoNhatKySuDungTGT } from './BaoCaoTGTDto';
import { ParamSearchBaoCaoTGT } from './ParamSearchBaoCaoTGT';

class BaoCaoTGTService {
    GetNhatKySuDungTGT = async (
        input: ParamSearchBaoCaoTGT
    ): Promise<PagedResultDto<IBaocaoNhatKySuDungTGT> | null> => {
        const xx = await http.post('api/services/app/BaoCao/GetNhatKySuDungTGT_ChiTiet', input);
        return xx.data.result;
    };
    ExportToExcel_BaoCaoSuDungTGTChiTiet = async (input: ParamSearchBaoCaoTGT): Promise<IFileDto> => {
        const xx = await http.post('api/services/app/BaoCao/ExportToExcel_BaoCaoSuDungTGTChiTiet', input);
        return xx.data.result;
    };
}

export default new BaoCaoTGTService();
