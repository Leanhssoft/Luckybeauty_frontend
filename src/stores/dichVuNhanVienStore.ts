import { makeAutoObservable } from 'mobx';
import { DichVuNhanVienDetailDto } from '../services/dichvu_nhanvien/dto/DichVuNhanVienDetailDto';
import dichVuNhanVienService from '../services/dichvu_nhanvien/dichVuNhanVienService';

class DichVuNhanVienStore {
    idNhanVien!: string;
    dichVuNhanVienDetail!: DichVuNhanVienDetailDto;
    selectedIdService!: string[];
    constructor() {
        this.selectedIdService = [];
        makeAutoObservable(this);
    }
    async getDichVuNhanVienDetail(idNhanVien: string) {
        const data = await dichVuNhanVienService.getDichVuNhanVienDetail(idNhanVien);
        this.dichVuNhanVienDetail = data;
        this.selectedIdService = this.dichVuNhanVienDetail.dichVuThucHiens.map((item) => {
            return item.idDichVu;
        });
    }
    async createOrEditByEmployee() {
        const result = await dichVuNhanVienService.createOrEditByEmployee({
            idNhanVien: this.idNhanVien,
            idDonViQuiDois: this.selectedIdService
        });
        await this.getDichVuNhanVienDetail(this.idNhanVien);
        return result;
    }
}
export default new DichVuNhanVienStore();
