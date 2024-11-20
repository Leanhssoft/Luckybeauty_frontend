import Cookies from 'js-cookie';
import http from '../../httpService';
import ILichSuNap_ChuyenTienDto, { INhatKyChuyenTienDto } from './ILichSuNap_ChuyenTienDto';
import utils from '../../../utils/utils';
import { PagedResultDto } from '../../dto/pagedResultDto';
import { ParamSearchDto } from '../../dto/ParamSearchDto';

class LichSuNap_ChuyenTienService {
    ThemMoiPhieuChuyenTien = async (input: ILichSuNap_ChuyenTienDto): Promise<ILichSuNap_ChuyenTienDto> => {
        const result = await http.post(`api/services/app/LichSuNap_ChuyenTien/ThemMoiPhieuChuyenTien`, input);
        return result.data.result;
    };
    CapNhatPhieuChuyenTien = async (input: ILichSuNap_ChuyenTienDto): Promise<ILichSuNap_ChuyenTienDto> => {
        const result = await http.post(`api/services/app/LichSuNap_ChuyenTien/CapNhatPhieuChuyenTien`, input);
        return result.data.result;
    };
    ThemMoi_CapNhatPhieuNapTien = async (tenantId: number, input: ILichSuNap_ChuyenTienDto) => {
        const result = await http.post(
            `api/services/app/LichSuNap_ChuyenTien/ThemMoi_CapNhatPhieuNapTien?tenantId=${tenantId}`,
            input
        );
        return result.data.result;
    };
    GetBrandnameBalance_byUserLogin = async (): Promise<number> => {
        const userId = Cookies.get('userId');
        if (!utils.checkNull(userId)) {
            const result = await http.get(
                `api/services/app/LichSuNap_ChuyenTien/GetBrandnameBalance_byUserLogin?userId=${userId}`
            );
            return result.data.result;
        }
        return 0;
    };
    XoaLichSuNapTien_byId = async (idPhieuNapTien: string): Promise<boolean> => {
        if (!utils.checkNull(idPhieuNapTien)) {
            const result = await http.get(
                `api/services/app/LichSuNap_ChuyenTien/XoaLichSuNapTien_byId?id=${idPhieuNapTien}`
            );
            return result.data.result;
        }
        return false;
    };
    GetNhatKyChuyenTien_byId = async (idPhieuNapTien: string): Promise<INhatKyChuyenTienDto | null> => {
        if (!utils.checkNull(idPhieuNapTien)) {
            const result = await http.get(
                `api/services/app/LichSuNap_ChuyenTien/GetNhatKyChuyenTien_byId?id=${idPhieuNapTien}`
            );
            return result.data.result;
        }
        return null;
    };
    GetAllNhatKyChuyenTien = async (input: ParamSearchDto): Promise<PagedResultDto<INhatKyChuyenTienDto>> => {
        const result = await http.get(`api/services/app/LichSuNap_ChuyenTien/GetAllNhatKyChuyenTien`, {
            params: { ...input }
        });
        return result.data.result;
    };
}

export default new LichSuNap_ChuyenTienService();
