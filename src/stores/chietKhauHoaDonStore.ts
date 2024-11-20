import Cookies from 'js-cookie';
import AppConsts from '../lib/appconst';
import { PagedRequestDto } from '../services/dto/pagedRequestDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { ChietKhauHoaDonItemDto } from '../services/hoa_hong/chiet_khau_hoa_don/Dto/ChietKhauHoaDonItemDto';
import { CreateOrEditChietKhauHoaDonDto } from '../services/hoa_hong/chiet_khau_hoa_don/Dto/CreateOrEditChietKhauHoaDonDto';
import ChietKhauHoaDonService from '../services/hoa_hong/chiet_khau_hoa_don/chietKhauHoaDonService';
import { action, makeAutoObservable, observable } from 'mobx';
import { ExecuteResultDto } from '../services/dto/ExecuteResultDto';

class ChietKhauHoaDonStore {
    id!: string;
    createOrEditDto!: CreateOrEditChietKhauHoaDonDto;
    chietKhauHoaDons!: PagedResultDto<ChietKhauHoaDonItemDto>;
    constructor() {
        makeAutoObservable(this, {
            createOrEditDto: observable,
            createModel: action
        });
    }
    async getAll(filter: PagedRequestDto) {
        const data = await ChietKhauHoaDonService.GetAll(filter, Cookies.get('IdChiNhanh') ?? undefined);
        this.chietKhauHoaDons = data;
    }
    async createOrEdit(input: CreateOrEditChietKhauHoaDonDto) {
        const result = await ChietKhauHoaDonService.CreateOrEdit(input);
        return result;
    }
    async delete(id: string) {
        await ChietKhauHoaDonService.Delete(id);
    }
    async getForEdit(id: string) {
        this.createOrEditDto = await ChietKhauHoaDonService.GetForEdit(id);
    }
    async createModel() {
        this.createOrEditDto = {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            chungTuApDung: '',
            giaTriChietKhau: 0,
            loaiChietKhau: 1,
            idNhanViens: [],
            ghiChu: ''
        };
    }
}
export default new ChietKhauHoaDonStore();
