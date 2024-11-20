import { IFileDto } from '../dto/FileDto';
import { FileUpload } from '../dto/FileUpload';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { CreateOrUpdateNhanSuDto } from './dto/createOrUpdateNhanVienDto';
import NhanSuDto from './dto/nhanSuDto';
import NhanSuItemDto from './dto/nhanSuItemDto';
import { PagedNhanSuRequestDto } from './dto/PagedNhanSuRequestDto';

class NhanVienService {
    public async createOrEdit(createOrEditInput: CreateOrUpdateNhanSuDto): Promise<NhanSuItemDto> {
        const result = await http.post('api/services/app/NhanSu/CreateOrEdit', createOrEditInput);
        return result.data.result;
    }
    public async getAll(input: PagedNhanSuRequestDto): Promise<PagedResultDto<NhanSuItemDto>> {
        const result = await http.get(`api/services/app/NhanSu/GetAll`, {
            params: input
        });
        return result.data.result;
    }
    public async search(keyword: string, input: PagedFilterAndSortedRequest): Promise<PagedResultDto<NhanSuItemDto>> {
        const result = await http.post(`api/services/app/NhanSu/Search?keyWord=${keyword.toString()}`, input);
        return result.data.result;
    }
    public async getNhanSu(id: string): Promise<CreateOrUpdateNhanSuDto> {
        const result = await http.post(`api/services/app/NhanSu/GetNhanSu?id=${id}`);
        return result.data.result;
    }
    public async delete(id: string): Promise<NhanSuDto> {
        const result = await http.post(`api/services/app/NhanSu/Delete?id=${id}`);
        return result.data.result;
    }
    public async deleteMany(ids: string[]) {
        const result = await http.post(`api/services/app/NhanSu/DeleteMany`, ids);
        return result.data.result;
    }
    public async exportDanhSachNhanVien(input: PagedNhanSuRequestDto): Promise<IFileDto> {
        const response = await http.post(`api/services/app/NhanSu/ExportDanhSach`, input);
        return response.data.result;
    }
    public async exportDanhSachNhanVienSelected(ids: string[]): Promise<IFileDto> {
        const response = await http.post(`api/services/app/NhanSu/ExportSelectedNhanVien`, ids);
        return response.data.result;
    }
    public async importNhanVien(input: FileUpload) {
        const result = await http.post(`api/services/app/NhanSu/ImportExcel`, input);
        return result.data.result;
    }
}
export default new NhanVienService();
