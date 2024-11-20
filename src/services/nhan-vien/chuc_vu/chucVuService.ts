import http from '../../httpService';
import { CreateOrEditChucVuDto } from './dto/CreateOrEditChucVuDto';

class ChucVuService {
    async CreateOrEditChucVu(input: CreateOrEditChucVuDto): Promise<CreateOrEditChucVuDto> {
        const response = await http.post(`/api/services/app/ChucVu/CreateOrEdit`, input);
        return response.data.result;
    }
    ChucVu_GetDetail_byId = async (idChucVu: string): Promise<CreateOrEditChucVuDto> => {
        const response = await http.get(`/api/services/app/ChucVu/GetDetail?id=${idChucVu}`);
        return response.data.result;
    };
    ChucVu_Delete = async (idChucVu: string): Promise<CreateOrEditChucVuDto> => {
        const response = await http.get(`/api/services/app/ChucVu/Delete?id=${idChucVu}`);
        return response.data.result;
    };
}
export default new ChucVuService();
