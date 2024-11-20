import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { CreateNhatKyThaoTacDto } from './dto/CreateNhatKyThaoTacDto';
import NhatKyThaoTacItemDto from './dto/NhatKyThaoTacItemDto';
import { PagedNhatKyRequestDto } from './dto/PagedNhatKyRequestDto';

class NhatKyHoatDongService {
    public async getAll(input: PagedNhatKyRequestDto): Promise<PagedResultDto<NhatKyThaoTacItemDto>> {
        const result = await http.post('api/services/app/NhatKyThaoTac/GetAll', input);
        return result.data.result;
    }
    public async createNhatKyThaoTac(input: CreateNhatKyThaoTacDto) {
        const result = await http.post('api/services/app/NhatKyThaoTac/CreateNhatKyHoatDong', input);
        return result.data.result;
    }
    public async getDetail(id: string) {
        const result = await http.get(`api/services/app/NhatKyThaoTac/GetDetail?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string) {
        const result = await http.post(`api/services/app/NhatKyThaoTac/Delete?id=${id}`);
        return result.data.result;
    }
}
export default new NhatKyHoatDongService();
