import { PagedResultDto } from '../services/dto/pagedResultDto';
import { CreateOrUpdateNhanSuDto } from '../services/nhan-vien/dto/createOrUpdateNhanVienDto';
import NhanSuItemDto from '../services/nhan-vien/dto/nhanSuItemDto';
import NhanVienService from '../services/nhan-vien/nhanVienService';
import NhanSuDto from '../services/nhan-vien/dto/nhanSuDto';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';
import { action, makeObservable, observable } from 'mobx';
import AppConsts from '../lib/appconst';
import { PagedNhanSuRequestDto } from '../services/nhan-vien/dto/PagedNhanSuRequestDto';
import Cookies from 'js-cookie';

class NhanVienStore {
    listNhanVien!: PagedResultDto<NhanSuItemDto>;
    createEditNhanVien!: CreateOrUpdateNhanSuDto;
    id!: string;
    constructor() {
        makeObservable(this, {
            listNhanVien: observable,
            createEditNhanVien: observable,
            id: observable,
            createOrEdit: action,
            delete: action,
            search: action,
            getForEdit: action
        });
    }
    async createOrEdit(createOrEditNhanSuInput: CreateOrUpdateNhanSuDto) {
        const result = await NhanVienService.createOrEdit(createOrEditNhanSuInput);
        this.listNhanVien.items.push(result);
        await this.createNhanVien();
    }
    async delete(id: string) {
        await NhanVienService.delete(id);
    }
    async deleteMany(ids: string[]) {
        await NhanVienService.deleteMany(ids);
    }
    async search(keyWord: string, input: PagedFilterAndSortedRequest) {
        const result = await NhanVienService.search(keyWord, input);
        this.listNhanVien = result;
    }

    async getAll(input: PagedNhanSuRequestDto) {
        const result = await NhanVienService.getAll(input);
        this.listNhanVien = result;
    }
    async getForEdit(id: string) {
        const result = await NhanVienService.getNhanSu(id);
        this.createEditNhanVien = result;
    }
    async createNhanVien() {
        this.createEditNhanVien = {
            id: AppConsts.guidEmpty,
            maNhanVien: '',
            ho: '',
            tenLot: '',
            tenNhanVien: '',
            diaChi: '',
            soDienThoai: '',
            cccd: '',
            ngaySinh: '',
            kieuNgaySinh: 0,
            gioiTinh: 0,
            ngayCap: '',
            noiCap: '',
            avatar: '',
            idChucVu: '',
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            trangThai: 1,
            ghiChu: ''
        };
    }
}
export default new NhanVienStore();
