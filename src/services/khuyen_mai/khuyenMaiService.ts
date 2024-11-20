import { PagedRequestDto } from '../dto/pagedRequestDto';
import http from '../httpService';
import { CreateOrEditKhuyenMaiDto } from './dto/CreateOrEditKhuyenMaiDto';
class KhuyenMaiService {
    async CreateOrEditKhuyenMai(input: CreateOrEditKhuyenMaiDto) {
        const response = await http.post('api/services/app/KhuyenMai/CreateOrEdit', input);
        return response.data.result;
    }
    async GetForEdit(id: string) {
        const response = await http.get(`api/services/app/KhuyenMai/GetForEdit?id=${id}`);
        return response.data.result;
    }
    async GetAll(input: PagedRequestDto) {
        const response = await http.post(`api/services/app/KhuyenMai/GetAll`, input);
        return response.data.result;
    }
    async Delete(id: string) {
        const response = await http.post(`api/services/app/KhuyenMai/Delete?id=${id}`);
        return response.data.result;
    }
}
export default new KhuyenMaiService();
