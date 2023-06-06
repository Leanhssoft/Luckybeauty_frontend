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
    public async CreateOrEdit(input: CreateOrEditChiNhanhDto): Promise<ChiNhanhDto> {
        const result = await http.post('api/services/app/ChiNhanh/CreateOrEditChiNhanh', input);
        return result.data.result;
    }
    public async Delete(id: string) {
        const result = await http.post(`api/services/app/ChiNhanh/DeleteChiNhanh?Id=${id}`);
        return result.data.result;
    }
    public async GetForEdit(id: string) {
        const result = await http.get(`api/services/app/ChiNhanh/GetForEdit?Id=${id}`);
        return result.data.result;
    }
    public async GetDetail(id: string) {
        const result = await http.get(`api/services/app/ChiNhanh/GetChiNhanh?Id=${id}`);
        return result.data.result;
    }
    public async GetChiNhanhByUser(): Promise<SuggestChiNhanhDto[]> {
        const response = await http.get('api/services/app/ChiNhanh/GetChiNhanhByUser');
        return response.data.result;
    }
}
export default new ChiNhanhService();