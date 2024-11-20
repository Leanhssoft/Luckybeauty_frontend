import { ExecuteResultDto } from '../../dto/ExecuteResultDto';
import { PagedRequestDto } from '../../dto/pagedRequestDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { ChietKhauHoaDonDto } from './Dto/ChietKhauHoaDonDto';
import { ChietKhauHoaDonItemDto } from './Dto/ChietKhauHoaDonItemDto';
import { CreateOrEditChietKhauHoaDonDto } from './Dto/CreateOrEditChietKhauHoaDonDto';

class ChietKhauHoaDonService {
    public async GetAll(input: PagedRequestDto, idChiNhanh?: string): Promise<PagedResultDto<ChietKhauHoaDonItemDto>> {
        const result = await http.get('api/services/app/ChietKhauHoaDon/GetAll', {
            params: { ...input, idChiNhanh }
        });
        return result.data.result;
    }
    public async GetForEdit(id: string): Promise<CreateOrEditChietKhauHoaDonDto> {
        const result = await http.get(`api/services/app/ChietKhauHoaDon/GetForEdit?id=${id}`);
        return result.data.result;
    }
    public async CreateOrEdit(input: CreateOrEditChietKhauHoaDonDto) {
        const result = await http.post('api/services/app/ChietKhauHoaDon/CreateOrEdit', input);
        return result.data.result;
    }
    public async Delete(id: string): Promise<ChietKhauHoaDonDto> {
        const result = await http.post(`api/services/app/ChietKhauHoaDon/Delete?id=${id}`);
        return result.data.result;
    }
    GetHoaHongNVienSetup_theoLoaiChungTu = async (
        idChiNhanh: string,
        idNhanVien: string,
        loaiChungTu: string
    ): Promise<ChietKhauHoaDonDto[]> => {
        const result = await http.get(
            `api/services/app/ChietKhauHoaDon/GetHoaHongNVienSetup_theoLoaiChungTu?idChiNhanh=${idChiNhanh}&idNhanVien=${idNhanVien}&loaiChungTu=${loaiChungTu}`
        );
        return result.data.result;
    };
}
export default new ChietKhauHoaDonService();
