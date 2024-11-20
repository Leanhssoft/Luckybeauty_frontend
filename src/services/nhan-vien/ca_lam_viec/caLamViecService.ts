import { ExecuteResultDto } from '../../dto/ExecuteResultDto';
import { IFileDto } from '../../dto/FileDto';
import { FileUpload } from '../../dto/FileUpload';
import { PagedRequestDto } from '../../dto/pagedRequestDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import http from '../../httpService';
import { CaLamViecDto } from './dto/caLamViecDto';
import { CreateOrEditCaLamViecDto } from './dto/createOrEditCaLamViecDto';

class CaLamViecService {
    async getAll(input: PagedRequestDto): Promise<PagedResultDto<CaLamViecDto>> {
        const response = await http.get('api/services/app/CaLamViec/GetAll', {
            params: {
                input
            }
        });
        return response.data.result;
    }
    async getForEdit(id: string): Promise<CreateOrEditCaLamViecDto> {
        const response = await http.get(`api/services/app/CaLamViec/GetForEdit?id=${id}`);
        return response.data.result;
    }
    async delete(id: string): Promise<CaLamViecDto> {
        const response = await http.post(`api/services/app/CaLamViec/Delete?id=${id}`);
        return response.data.result;
    }
    async deleteMany(ids: string[]) {
        const response = await http.post(`api/services/app/CaLamViec/DeleteMany`, ids);
        return response.data.result;
    }
    async ceateOrEdit(input: CreateOrEditCaLamViecDto): Promise<CaLamViecDto> {
        const response = await http.post(`api/services/app/CaLamViec/CreateOrEdit`, input);
        return response.data.result;
    }
    async exportToExcel(input: PagedRequestDto): Promise<IFileDto> {
        const response = await http.post(`api/services/app/CaLamViec/ExportToExcel`, input);
        return response.data.result;
    }
    async exportSelectedItemToExcel(ids: string[]): Promise<IFileDto> {
        const response = await http.post(`api/services/app/CaLamViec/ExportSelectedCaLamViec`, ids);
        return response.data.result;
    }
    async importExcel(input: FileUpload) {
        const response = await http.post(`api/services/app/CaLamViec/ImportExcel`, input);
        return response.data.result;
    }
}
export default new CaLamViecService();
