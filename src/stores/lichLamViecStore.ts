import { makeAutoObservable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { LichLamViecNhanVienDto } from '../services/nhan-vien/lich_lam_viec/dto/LichLamViecNhanVienDto';
import { PagedRequestLichLamViecDto } from '../services/nhan-vien/lich_lam_viec/dto/PagedRequsetLichLamViec';
import lichLamViecService from '../services/nhan-vien/lich_lam_viec/lichLamViecService';
import Cookies from 'js-cookie';
import { CreateOrEditLichLamViecDto } from '../services/nhan-vien/lich_lam_viec/dto/CreateOrEditLichLamViecDto';
import AppConsts from '../lib/appconst';
import { format as formatDate } from 'date-fns';

class LichLamViecStore {
    listLichLamViec: PagedResultDto<LichLamViecNhanVienDto> = {
        items: [],
        totalCount: 0,
        totalPage: 0
    };
    createLichLamViecDto: CreateOrEditLichLamViecDto = {
        id: AppConsts.guidEmpty,
        idNhanVien: AppConsts.guidEmpty,
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idCaLamViec: '',
        tuNgay: formatDate(new Date(), 'yyyy-MM-dd'),
        denNgay: formatDate(new Date(), 'yyyy-MM-dd'),
        lapLai: false,
        kieuLapLai: 0,
        giaTriLap: 0,
        ngayLamViec: [] as string[]
    };
    dateFrom: Date = new Date();
    idNhanVien!: string;
    totalCount!: number;
    totalPage!: number;
    skipCount!: number;
    maxResultCount!: number;
    constructor() {
        makeAutoObservable(this);
        this.totalCount = 0;
        this.totalPage = 0;
        this.skipCount = 1;
        this.maxResultCount = 10;
    }
    async createModel() {
        this.createLichLamViecDto = {
            id: AppConsts.guidEmpty,
            idNhanVien: AppConsts.guidEmpty,
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            idCaLamViec: '',
            tuNgay: formatDate(new Date(), 'yyyy-MM-dd'),
            denNgay: '',
            lapLai: false,
            kieuLapLai: 0,
            giaTriLap: 0,
            ngayLamViec: [] as string[]
        };
    }
    async getLichLamViecNhanVienWeek(input: PagedRequestLichLamViecDto) {
        this.listLichLamViec.items = [];
        const result = await lichLamViecService.getAllLichLamViecWeek({
            ...input,
            skipCount: this.skipCount,
            maxResultCount: this.maxResultCount,
            dateFrom: this.dateFrom,
            dateTo: this.dateFrom,
            idNhanVien: this.idNhanVien == '' ? undefined : this.idNhanVien
        });
        this.listLichLamViec = result;
        this.totalCount = result.totalCount;
        this.totalPage = Math.ceil(result.totalCount / this.maxResultCount);
    }
    async updateIdNhanVien(id: string) {
        this.idNhanVien = id;
    }
    async updateDate(date: Date) {
        this.dateFrom = date;
    }
    async updatePageChange(page: number) {
        this.skipCount = page;
    }
    async updatePerPageChange(page: number) {
        this.maxResultCount = page;
    }
    async getForEdit(id: string) {
        const data = await lichLamViecService.getForEdit(id);
        this.createLichLamViecDto = data;
    }
}
export default new LichLamViecStore();
