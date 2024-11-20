import { makeAutoObservable } from 'mobx';
import { CreateOrEditKhuyenMaiDto } from '../services/khuyen_mai/dto/CreateOrEditKhuyenMaiDto';
import AppConsts from '../lib/appconst';
import { format } from 'date-fns';
import khuyenMaiService from '../services/khuyen_mai/khuyenMaiService';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { KhuyenMaiViewDto } from '../services/khuyen_mai/dto/KhuyenMaiViewDto';
import { PagedRequestDto } from '../services/dto/pagedRequestDto';

class KhuyenMaiStore {
    createOrEditKhuyenMaiDto!: CreateOrEditKhuyenMaiDto;
    listKhuyenMai!: PagedResultDto<KhuyenMaiViewDto>;
    constructor() {
        this.createNewModel();
        makeAutoObservable(this);
    }
    createNewModel() {
        this.createOrEditKhuyenMaiDto = {
            hinhThucKM: 11,
            id: AppConsts.guidEmpty,
            loaiKhuyenMai: 1,
            maKhuyenMai: '',
            tatCaChiNhanh: true,
            tatCaKhachHang: true,
            tatCaNhanVien: true,
            trangThai: 1,
            tenKhuyenMai: '',
            thoiGianApDung: format(new Date(), 'yyyy-MM-dd'),
            thoiGianKetThuc: '',
            khuyenMaiChiTiets: [
                {
                    id: AppConsts.guidEmpty
                }
            ]
        };
    }
    async CreateOrEditKhuyenMai(input: CreateOrEditKhuyenMaiDto) {
        const result = await khuyenMaiService.CreateOrEditKhuyenMai(input);
        return result;
    }
    async GetForEdit(id: string) {
        const result = await khuyenMaiService.GetForEdit(id);
        this.createOrEditKhuyenMaiDto = result;
    }
    async getAll(input: PagedRequestDto) {
        const result = await khuyenMaiService.GetAll(input);
        this.listKhuyenMai = result;
    }
    async delete(id: string) {
        const result = await khuyenMaiService.Delete(id);
    }
}
export default new KhuyenMaiStore();
