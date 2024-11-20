import { makeAutoObservable } from 'mobx';
import AppConsts from '../lib/appconst';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { CaLamViecDto } from '../services/nhan-vien/ca_lam_viec/dto/caLamViecDto';
import { CreateOrEditCaLamViecDto } from '../services/nhan-vien/ca_lam_viec/dto/createOrEditCaLamViecDto';
import { PagedRequestDto } from '../services/dto/pagedRequestDto';
import caLamViecService from '../services/nhan-vien/ca_lam_viec/caLamViecService';
import Cookies from 'js-cookie';

class CaLamViecStore {
    createOrEditDto: CreateOrEditCaLamViecDto = {
        id: AppConsts.guidEmpty,
        idChiNhanh: AppConsts.guidEmpty,
        gioRa: '',
        gioVao: '',
        maCa: '',
        tenCa: '',
        tongSoGioCong: 0,
        laNghiGiuaCa: false
    };
    caLamViecs!: PagedResultDto<CaLamViecDto>;
    constructor() {
        makeAutoObservable(this);
    }
    async createCaLamViecDto() {
        this.createOrEditDto = {
            id: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? AppConsts.guidEmpty,
            gioRa: '',
            gioVao: '',
            maCa: '',
            tenCa: '',
            tongSoGioCong: 0,
            laNghiGiuaCa: false
        };
    }
    async getAll(input: PagedRequestDto) {
        const result = await caLamViecService.getAll(input);
        this.caLamViecs = result;
    }
    async getForEdit(id: string) {
        this.createOrEditDto = await caLamViecService.getForEdit(id);
    }

    async delete(id: string) {
        const result = await caLamViecService.delete(id);
        this.caLamViecs.items.filter((x) => x.id == result.id);
    }
    async createOrEdit(input: CreateOrEditCaLamViecDto) {
        await caLamViecService.ceateOrEdit(input);
    }
}
export default new CaLamViecStore();
