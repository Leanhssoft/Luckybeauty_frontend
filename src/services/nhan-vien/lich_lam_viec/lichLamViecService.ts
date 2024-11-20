import { FileUpload } from '../../dto/FileUpload';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { CreateOrEditLichLamViecDto } from './dto/CreateOrEditLichLamViecDto';
import { LichLamViecDto } from './dto/LichLamViecDto';
import { LichLamViecNhanVienDto } from './dto/LichLamViecNhanVienDto';
import { PagedRequestLichLamViecDto } from './dto/PagedRequsetLichLamViec';

class LichLamViecService {
    public async getAllLichLamViecWeek(
        input: PagedRequestLichLamViecDto
    ): Promise<PagedResultDto<LichLamViecNhanVienDto>> {
        const response = await http.get('api/services/app/LichLamViec/GetAllLichLamViecWeek', {
            params: input
        });
        return response.data.result;
    }
    public async createOrEditLichLamViec(input: CreateOrEditLichLamViecDto): Promise<boolean> {
        const response = await http.post('api/services/app/LichLamViec/CreateOrEdit', input);
        return response.data.success;
    }
    public async delete(id: string) {
        const response = await http.post(`api/services/app/LichLamViec/Delete?id=${id}`);
        return response.data.result;
    }
    public async getForEdit(id: string) {
        const response = await http.get(`api/services/app/LichLamViec/GetForEdit?id=${id}`);
        return response.data.result;
    }
    // public async inportLichLamViec(input: FileUpload) {
    //     const result = await http.post(`api/services/app/NhanSu/Delete`);
    //     return result.data.result;
    // }
}
export default new LichLamViecService();
