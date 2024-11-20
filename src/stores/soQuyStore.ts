import { makeAutoObservable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import SoQuyServices from '../services/so_quy/SoQuyServices';
import { RequestFromToDto } from '../services/dto/ParamSearchDto';
import QuyHoaDonDto from '../services/so_quy/QuyHoaDonDto';

class SoQuyStore {
    lstSoQuy!: PagedResultDto<QuyHoaDonDto>;
    constructor() {
        makeAutoObservable(this);
    }
    async getAll(input: RequestFromToDto) {
        const response = await SoQuyServices.getAll(input);
        this.lstSoQuy = response;
    }
}
export default new SoQuyStore();
