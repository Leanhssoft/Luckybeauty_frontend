import { PagedRequestDto } from '../dto/pagedRequestDto';
import http from '../httpService';
import { CreateOrEditTaiKhoanNganHangDto } from './Dto/createOrEditTaiKhoanNganHangDto';

class TaiKhoanNganHangService {
    public async createOrEdit(input: CreateOrEditTaiKhoanNganHangDto) {
        const response = await http.post('api/services/app/TaiKhoanNganHang/CreateOrEdit', input);
        return response.data.result;
    }
    public async getAll(input: PagedRequestDto) {
        const response = await http.get('api/services/app/TaiKhoanNganHang/GetAll', {
            params: input
        });
        return response.data.result;
    }
    public async getForEdit(id: string): Promise<CreateOrEditTaiKhoanNganHangDto> {
        const response = await http.get(`api/services/app/TaiKhoanNganHang/GetForEdit?id=${id}`);
        return response.data.result;
    }
    public async delete(id: string) {
        const response = await http.post(`api/services/app/TaiKhoanNganHang/Delete?id=${id}`);
        return response.data.result;
    }
}
export default new TaiKhoanNganHangService();
