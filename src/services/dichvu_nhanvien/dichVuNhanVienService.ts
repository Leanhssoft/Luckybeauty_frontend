import http from '../httpService';
import { CreateOrEditDichVuNhanVienByNhanVien } from './dto/CreateOrEditByEmployeeDto';
import { CreateOrEditDichVuNhanVienByDichVu } from './dto/CreateOrEditByServiceDto';

class DichVuNhanVienDetailDto {
    async getDichVuNhanVienDetail(idNhanVien: string) {
        const response = await http.post(`api/services/app/NhanVienDichVu/GetDetail?idNhanVien=${idNhanVien}`);
        return response.data.result;
    }
    async createOrEditByEmployee(input: CreateOrEditDichVuNhanVienByNhanVien) {
        const response = await http.post(`api/services/app/NhanVienDichVu/CreateOrUpdateServicesByEmployee`, input);
        return response.data.result;
    }
    async createOrEditByService(input: CreateOrEditDichVuNhanVienByDichVu) {
        const response = await http.post(`api/services/app/NhanVienDichVu/CreateOrUpdateEmployeeByService`, input);
        return response.data.result;
    }
}
export default new DichVuNhanVienDetailDto();
