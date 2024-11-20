import utils from '../../utils/utils';
import { ExecuteResultDto } from '../dto/ExecuteResultDto';
import { IFileDto } from '../dto/FileDto';
import { FileUpload } from '../dto/FileUpload';
import { PagedRequestDto } from '../dto/pagedRequestDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { SuggestChiNhanhDto } from '../suggests/dto/SuggestChiNhanhDto';
import { ChiNhanhDto } from './Dto/chiNhanhDto';
import { CreateOrEditChiNhanhDto } from './Dto/createOrEditChiNhanhDto';
class ChiNhanhService {
    public async GetAll(input: PagedRequestDto): Promise<PagedResultDto<ChiNhanhDto>> {
        const result = await http.get('api/services/app/ChiNhanh/GetAllChiNhanh', {
            params: input
        });
        return result.data.result;
    }
    public async CreateOrEdit(input: CreateOrEditChiNhanhDto): Promise<ExecuteResultDto> {
        const result = await http.post('api/services/app/ChiNhanh/CreateOrEditChiNhanh', input);
        return result.data.result;
    }

    public async Delete(id: string): Promise<ExecuteResultDto> {
        const result = await http.post(`api/services/app/ChiNhanh/DeleteChiNhanh?Id=${id}`);
        return result.data.result;
    }
    public async DeleteMany(ids: string[]): Promise<ExecuteResultDto> {
        const result = await http.post(`api/services/app/ChiNhanh/DeleteMany`, ids);
        return result.data.result;
    }
    public async GetForEdit(id: string) {
        const result = await http.get(`api/services/app/ChiNhanh/GetForEdit?Id=${id}`);
        return result.data.result;
    }
    public async GetDetail(id: string) {
        if (utils.checkNull(id)) return;
        const result = await http.get(`api/services/app/ChiNhanh/GetChiNhanh?Id=${id}`);
        return result.data.result;
    }
    public async GetChiNhanhByUser(): Promise<SuggestChiNhanhDto[]> {
        const response = await http.get('api/services/app/ChiNhanh/GetChiNhanhByUser');
        return response.data.result;
    }
    public async exportDanhSach(input: PagedRequestDto): Promise<IFileDto> {
        const response = await http.post(`api/services/app/ChiNhanh/ExportDanhSach`, input);
        return response.data.result;
    }
    public async exportDanhSachSelected(ids: string[]): Promise<IFileDto> {
        const response = await http.post(`api/services/app/ChiNhanh/ExportSelectedDanhSach`, ids);
        return response.data.result;
    }
    public async importChiNhanh(input: FileUpload) {
        const result = await http.post(`api/services/app/ChiNhanh/ImportExcel`, input);
        return result.data.result;
    }
}
export default new ChiNhanhService();
