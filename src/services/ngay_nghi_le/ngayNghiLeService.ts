import { ExecuteResultDto } from '../dto/ExecuteResultDto';
import { IFileDto } from '../dto/FileDto';
import { FileUpload } from '../dto/FileUpload';
import { PagedRequestDto } from '../dto/pagedRequestDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { NgayNghiLeDto } from './dto/NgayNghiLeDto';
import { CreateOrEditNgayNghiLeDto } from './dto/createOrEditNgayNghiLe';
class NgayNghiLeService {
    public async getAll(input: PagedRequestDto): Promise<PagedResultDto<NgayNghiLeDto>> {
        const result = await http.get('api/services/app/NgayNghiLe/GetAll', { params: input });
        return result.data.result;
    }
    public async getForEdit(id: string): Promise<CreateOrEditNgayNghiLeDto> {
        const result = await http.post(`api/services/app/NgayNghiLe/GetForEdit?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string) {
        const result = await http.post(`api/services/app/NgayNghiLe/Delete?id=${id}`);
        return result.data.result;
    }
    public async deleteMany(ids: string[]) {
        const result = await http.post(`api/services/app/NgayNghiLe/DeleteMany`, ids);
        return result.data.result;
    }
    public async createOrEdit(input: CreateOrEditNgayNghiLeDto): Promise<NgayNghiLeDto> {
        const result = await http.post(`api/services/app/NgayNghiLe/CreateOrEdit`, input);
        return result.data.result;
    }
    async exportToExcel(input: PagedRequestDto): Promise<IFileDto> {
        const response = await http.post(`api/services/app/NgayNghiLe/ExportToExcel`, input);
        return response.data.result;
    }
    async exportSelectedItemToExcel(ids: string[]): Promise<IFileDto> {
        const response = await http.post(`api/services/app/NgayNghiLe/ExportSelectedNghiLe`, ids);
        return response.data.result;
    }
    async importExcel(input: FileUpload) {
        const response = await http.post(`api/services/app/NgayNghiLe/ImportExcel`, input);
        return response.data.result;
    }
}
export default new NgayNghiLeService();
